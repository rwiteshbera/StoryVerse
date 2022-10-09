const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = mongoose.model("Post");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const requireLogin = require("../middleware/requireLogin");
const path = require("path");
const DataUriParser = require("datauri/parser");
const {
  CLOUDINARY_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = process.env;
const parser = new DataUriParser();

// Return "https" URLs by setting secure: true
cloudinary.config({
  secure: true,
  api_secret: CLOUDINARY_API_SECRET,
  api_key: CLOUDINARY_API_KEY,
  cloud_name: CLOUDINARY_NAME,
});

// Get the posts of the users you follow in homepage
router.get("/feedPosts", requireLogin, (req, res) => {
  Post.find({ postedBy: { $in: req.user.following } })
    .populate("postedBy", "name email profilePhoto")
    .then((posts) => {
      res.json({ posts: posts });
    })
    .catch((err) => {
      console.log(err);
    });
});

const upload = multer();
// Upload new image on socials
router.post("/upload", upload.single("file"), requireLogin, (req, res) => {
  try {
    if (!req.body.file && !req.body.captions) {
      const extname = path.extname(req.file.originalname).toString();
      const file64 = parser.format(extname, req.file.buffer);
      // Use the uploaded file's name as the asset's public ID and
      // allow overwriting the asset with new versions
      const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      };

      try {
        cloudinary.uploader
          .upload(file64.content, options)
          .then((data) => {
            console.log(data.url);
            return res.json(data);
          })
          .catch((e) => {
            return res.status(422).json({ error: e });
          });

        const post = new Post({
          captions: req.body.captions,
          photo: data.url,
          postedBy: req.user,
        });

        post
          .save()
          .then(() => {
            res.json({ message: "Posted successfully" });
          })
          .catch((err) => {
            res.status(401).json({ err });
          });
      } catch (error) {
        res.json({ "Failed to upload data": error });
      }
    }
  } catch (e) {
    return res.status(422).json({ error: e });
  }
});

// All the post created by the logged-in user
router.get("/mypost", requireLogin, (req, res) => {
  Post.find({ postedBy: req.user._id })
    .then((myposts) => {
      return res.json(myposts);
    })
    .catch((err) => {
      console.log(err);
    });
});

// Like button
router.put("/like", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $addToSet: { likes: req.user._id },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      return res.json(result);
    }
  });
});

// Unlike button
router.put("/unlike", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      return res.json(result);
    }
  });
});

// delete your own post
router.delete("/delete/:postId", requireLogin, (req, res) => {
  try {
    const result = Post.findOne({ _id: req.params.postId })
      .populate("postedBy", "_id")
      .exec((err, post) => {
        if (err || !post) {
          return console.log("ERROR");
        }
        post
          .remove()
          .then((result) => {
            return res.json(result);
          })
          .catch((error) => {
            console.log(error);
          });
      });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
