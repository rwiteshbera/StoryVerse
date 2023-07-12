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

const parser = new DataUriParser();

// Return "https" URLs by setting secure: true
cloudinary.config({
  secure: true,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  api_key: process.env.CLOUDINARY_API_KEY,
  cloud_name: process.env.CLOUDINARY_NAME,
});
// Cloudinary Setup

// fetch logged-in user data
router.get("/v1/user", authorization, async (req, res) => {
  const { _id } = req.user;
  try {
    const data = await User.findById(_id).exec();
    const {
      name,
      username,
      email,
      profilePhoto,
      gender,
      following,
      followers,
    } = data;
    return res.status(200).json({
      message: {
        name,
        username,
        email,
        profilePhoto,
        gender,
        following,
        followers,
      },
    });
  } catch (err) {
    return res.status(422).json({ error: err });
  }
});

const upload = multer({
  storage: multer.memoryStorage(),
});
// Change your profile Photo
router.patch(
  "/v1/profile-photo/change",
  upload.single("file"),
  authorization,
  async (req, res) => {
    if (!req.file) {
      return res.status(422).json({ message: "no image found" });
    }

    const _id = req.user._id;
    if (!_id) {
      return res.status(500).json({ error: "unable to change photo" });
    }

    const extname = path.extname(req.file.originalname).toString();
    const file64 = parser.format(extname, req.file.buffer);

    if (extname !== ".jpeg" && fileExt !== ".png" && fileExt !== ".jpg") {
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
        return res.status(422).json({ error: "unable to change photo" });
      }

      // Get Userdata
      const userdata = await User.findById(_id);

      if (!userdata) {
        return res.status(422).json({ error: "unable to change photo" });
      }

      // Extract Public Id of Previous Image from URL
      const publicIdToDelete = userdata.profilePhoto.substring(
        userdata.profilePhoto.lastIndexOf("/") + 1,
        userdata.profilePhoto.lastIndexOf(".")
      );

      // Update Image URL in MongoDatabase
      const data = await User.findByIdAndUpdate(_id, {
        profilePhoto: cloudinaryResponse.secure_url,
      });

      // Remove Previous Image From Cloudinary
      await cloudinary.uploader.destroy(publicIdToDelete);

      return res.status(200).json({ message: data.profilePhoto });
    } catch (error) {
      return res.status(500).json({ error: "unable to change photo" });
    }
  }
);

// See other user's profile
router.get("/v1/user/:username", authorization, async (req, res) => {
  const username = req.params.username;

  try {
    const userData = await User.findOne(
      { username },
      "-email -password -logInActivity -isDeactivated" // Get all the fields except these
    ).exec();

    if (userData == null) {
      return res.status(401).json({ data: "no user found" });
    }

    const posts = await Post.find({ postedBy: userData._id })
      .populate("postedBy", "_id username")
      .exec();

    return res.status(200).json({ data: userData, posts: posts });
  } catch (err) {
    return res.status(422).json({ error: err });
  }
});

// Follow users
router.put("/v1/follow", authorization, async (req, res) => {
  const { username } = req.body;
  try {
    const followedUser = await User.findOneAndUpdate(
      { username: username },
      {
        $addToSet: { followers: req.user._id },
      },
      { new: true }
    ).exec();

    if (followedUser) {
      var you = await User.findByIdAndUpdate(
        req.user._id,
        {
          $addToSet: { following: followedUser._id },
        },
        { new: true }
      )
        .select("-_id following followers")
        .exec();
    }
    return res.status(200).json({ data: you });
  } catch (error) {
    res.status(500).json({ error: "Failed to follow the user." });
  }
});

// Unfollow users
router.put("/v1/unfollow", authorization, async (req, res) => {
  const { username } = req.body;
  try {
    const unfollowedUser = await User.findOneAndUpdate(
      { username: username },
      {
        $pull: { followers: req.user._id },
      },
      { new: true }
    ).exec();

    if (unfollowedUser) {
      var you = await User.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { following: unfollowedUser._id },
        },
        { new: true }
      )
        .select("-_id following followers")
        .exec();
    }

    return res.status(200).json({ data: you });
  } catch (error) {
    res.status(500).json({ error: err });
  }
});

// search user
router.post("/search", (req, res) => {
  // "i" means ignoring case
  let pattern = new RegExp("^" + req.body.query, "i");

  User.find({ name: { $regex: pattern } })
    .select("_id, -password")
    .then((user) => {
      return res.json({ user });
    })
    .catch((err) => {
      return res.status(422).json({ err });
    });
});

// Get following users list
router.get("/v1/following", authorization, async (req, res) => {
  const { username } = req.body;
  try {
    const user = await User.findOne({ username: username }).exec();
    if (!user) {
      return res.status(422).json({ error: "failed to fetch data" });
    }
    const followingList = await User.find({ _id: user.following })
      .select("-_id name username profilePhoto")
      .exec();
    return res.status(200).json({ following: followingList });
  } catch (error) {
    return res.status(500).json({ error });
  }
});

// Get followers list
router.get("/v1/followers", authorization, async (req, res) => {
  const { username } = req.body;
  try {
    const user = await User.findOne({ username: username }).exec();
    if (!user) {
      return res.status(422).json({ error: "failed to fetch data" });
    }
    const followingList = await User.find({ _id: user.followers })
      .select("-_id name username profilePhoto")
      .exec();
    return res.status(200).json({ followers: followingList });
  } catch (error) {
    return res.status(500).json({ error });
  }
});

module.exports = router;
