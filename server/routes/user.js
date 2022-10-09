const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = mongoose.model("Post");
const User = mongoose.model("User");
const requireLogin = require("../middleware/requireLogin");

// Cloudinary Setup
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const path = require("path");
const DataUriParser = require("datauri/parser");
const {
  CLOUDINARY_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = require("../keys");
const parser = new DataUriParser();

// Return "https" URLs by setting secure: true
cloudinary.config({
  secure: true,
  api_secret: CLOUDINARY_API_SECRET,
  api_key: CLOUDINARY_API_KEY,
  cloud_name: CLOUDINARY_NAME,
});
// Cloudinary Setup

// fetch logged-in user data
router.get("/me", requireLogin, (req, res) => {
  const {
    _id,
    name,
    username,
    email,
    gender,
    followers,
    following,
    profilePhoto,
    loggedInActivity,
  } = req.user;
  return res.json({
    _id,
    name,
    username,
    email,
    gender,
    followers,
    following,
    profilePhoto,
    loggedInActivity,
  });
});

const upload = multer();
// Change your profile Photo
router.patch(
  "/change_profile_pic",
  upload.single("file"),
  requireLogin,
  (req, res) => {
    if (!req.file) {
      return res.json({ message: "No image found" });
    }

    const extname = path.extname(req.file.originalname).toString();
    const file64 = parser.format(extname, req.file.buffer);
    // Use the uploaded file's name as the asset's public ID and
    // allow overwriting the asset with new versions
    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    };

    cloudinary.uploader
      .upload(file64.content, options)
      .then((data) => {
        User.findByIdAndUpdate(
          req.user._id,
          { profilePhoto: data.secure_url },
          { new: true },
          (err, result) => {
            if (err) {
              return res.status(422).json({ error: err });
            } else {
              // console.log(result)
              return res.json({ message: result });
            }
          }
        );
      })
      .catch((e) => {
        return res.status(422).json({ error: e });
      });
  }
);

// See other user's profile
router.get("/user/:id", requireLogin, (req, res) => {
  User.findOne({ _id: req.params.id })
    .select("-password") // Get all the fields except password
    .then((user) => {
      Post.find({ postedBy: req.params.id })
        .populate("postedBy", "_id name")
        .exec((err, posts) => {
          if (err) {
            return res.status(422).json({ error: err });
          }
          res.json({ user, posts });
        });
    })
    .catch((err) => {
      return res.status(404).json({ error: "User not found." });
    });
});

// Follow users
router.put("/follow", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.followId,
    {
      $addToSet: { followers: req.user._id },
    },
    { new: true }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    }
    User.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: { following: req.body.followId },
      },
      { new: true }
    )
      .then((result) => {
        const { password, ...rest } = result;
        return res.json(rest._doc);
      })
      .catch((err) => {
        return res.status(422).json({ error: err });
      });
  });
});

// Unfollow users
router.put("/unfollow", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.unfollowId,
    {
      $pull: { followers: req.user._id },
    },
    { new: true }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    }
    User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { following: req.body.unfollowId },
      },
      { new: true }
    )
      .then((result) => {
        const { password, ...rest } = result;
        return res.json(rest._doc);
      })
      .catch((err) => {
        return res.status(422).json({ error: err });
      });
  });
});

// search user
router.post("/search", (req, res) => {
  // "i" means ignoring case
  let pattern = new RegExp("^" + req.body.query, "i");

  User.find({ name: { $regex: pattern } })
    .select("-password")
    .then((user) => {
      return res.json({ user });
    })
    .catch((err) => {
      return res.status(422).json({ err });
    });
});

// Get following users list
router.post("/get_following", requireLogin, (req, res) => {
  User.find({ _id: req.body.following })
    .select("-password") // Get all the fields except password
    .then((users) => {
      res.json({ users });
    })
    .catch((err) => {
      return res.status(404).json({ error: "User not found." });
    });
});

// Get followers list
router.post("/get_followers", requireLogin, (req, res) => {
  User.find({ _id: req.body.followers })
    .select("-password") // Get all the fields except password
    .then((users) => {
      res.json({ users });
    })
    .catch((err) => {
      return res.status(404).json({ error: "User not found." });
    });
});

module.exports = router;
