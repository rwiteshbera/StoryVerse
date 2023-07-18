const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = mongoose.model("Post");
const User = mongoose.model("User");
const authorization = require("../middleware/authorization");

// Cloudinary Setup
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const path = require("path");
const DataUriParser = require("datauri/parser");

CLOUDINARY_NAME = process.env.CLOUDINARY_NAME;
CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

const parser = new DataUriParser();

// Return "https" URLs by setting secure: true
cloudinary.config({
  secure: true,
  api_secret: CLOUDINARY_API_SECRET,
  api_key: CLOUDINARY_API_KEY,
  cloud_name: CLOUDINARY_NAME,
});
// Cloudinary Setup

// Get the posts of the users you follow in homepage
router.get("/v1/feed", authorization, async (req, res) => {
  try {
    const loginUserData = await User.findOne({ _id: req.user._id });

    let feedPosts = await Post.find({
      postedBy: { $in: loginUserData.following },
    })
      .populate("postedBy", "-_id username profilePhoto")
      .populate("likes", "-_id username");

    feedPosts = feedPosts.map((post) => {
      // Check if the current login user has liked the post or not?
      const liked = post.likes.some(
        (like) => like.username === req.user.username
      );
      return { ...post.toObject(), adminLiked: liked };
    });

    return res.status(200).json({ message: feedPosts });
  } catch (error) {
    return res.status(500).json({ error: "failed to load posts" });
  }
});

const upload = multer({
  storage: multer.memoryStorage(),
});
// Upload new image on socials
router.post(
  "/v1/upload",
  upload.single("file"),
  authorization,
  async (req, res) => {
    if (!req.file && !req.body.caption) {
      return res
        .status(200)
        .json({ message: "Input field shouldn't be empty." });
    }

    const extname = path.extname(req.file.originalname).toString();
    const file64 = parser.format(extname, req.file.buffer);

    if (extname !== ".jpeg" && extname !== ".png" && extname !== ".jpg") {
      response
        .status(415)
        .json({ message: "only jpeg, jpg, png files are allowed" });
      return;
    }
    // Use the uploaded file's name as the asset's public ID and
    // allow overwriting the asset with new versions
    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    };

    try {
      // Upload image to cloudinary
      const cloudinaryResponse = await cloudinary.uploader.upload(
        file64.content,
        options
      );

      if (!cloudinaryResponse) {
        return res.status(422).json({ error: "unable to post" });
      }

      const post = new Post({
        captions: req.body.caption,
        photo: cloudinaryResponse.secure_url,
        postedBy: req.user,
      });

      const uploadPhotoRes = await post.save();

      return res.status(200).json({ message: uploadPhotoRes });
    } catch (error) {
      return res.status(500).json({ error: "unable to post" });
    }
  }
);

// All the post created by the logged-in user
router.get("/v1/user/posts", authorization, async (req, res) => {
  try {
    let posts = await Post.find({ postedBy: req.user._id })
      .populate("postedBy", "-_id username profilePhoto")
      .populate("likes", "-_id username");

    posts = posts.map((post) => {
      // Check if the current login user has liked the post or not?
      const liked = post.likes.some(
        (like) => like.username === req.user.username
      );
      return { ...post.toObject(), adminLiked: liked };
    });

    return res.status(200).json({ message: posts });
  } catch (error) {
    return res.status(500).json({ error: "unable to load posts" });
  }
});

// Like button
router.put("/v1/like/check", authorization, async (req, res) => {
  let { id } = req.query;

  try {
    const data = await Post.findByIdAndUpdate(
      id,
      {
        $addToSet: { likes: req.user._id },
      },
      { new: true }
    ).exec();

    return res.status(200).json({ message: data });
  } catch (error) {
    return res.status(422).json({ error: error });
  }
});

// Uncheck Like button
router.put("/v1/like/uncheck", authorization, async (req, res) => {
  let { id } = req.query;

  try {
    const data = await Post.findByIdAndUpdate(
      id,
      {
        $pull: { likes: req.user._id },
      },
      { new: true }
    ).exec();

    return res.status(200).json({ message: data });
  } catch (error) {
    return res.status(422).json({ error: error });
  }
});

// delete your own post
router.delete("/v1/delete/post", authorization, (req, res) => {
  try {
    Post.findOne({ _id: req.query.id })
      .populate("postedBy", "_id")
      .exec((error, post) => {
        if (error || !post) {
          return res.status(422).json({ message: error });
        }
        post
          .remove()
          .then((result) => {
            return res.status(200).json({ message: result });
          })
          .catch((error) => {
            return res.status(422).json({ message: error });
          });
      });
  } catch (error) {
    return res.status(422).json({ message: error });
  }
});

module.exports = router;
