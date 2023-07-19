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
router.get("/v1/user", authorization, async (request, response) => {
  const { _id } = request.user;
  try {
    const data = await User.findById(_id).exec();
    const { name, username, profilePhoto, bio, gender, following, followers } =
      data;
    return response.status(200).json({
      message: {
        name,
        username,
        profilePhoto,
        bio,
        gender,
        following,
        followers,
      },
    });
  } catch (err) {
    return response.status(422).json({ error: err });
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
  async (request, response) => {
    if (!request.file) {
      return response.status(422).json({ message: "no image found" });
    }

    const _id = request.user._id;
    if (!_id) {
      return response.status(500).json({ error: "unable to change photo" });
    }

    const extname = path.extname(request.file.originalname).toString();
    const file64 = parser.format(extname, request.file.buffer);

    if (extname !== ".jpeg" && extname !== ".png" && extname !== ".jpg") {
      response
        .status(415)
        .json({ message: "only jpeg, jpg, png files are allowed" });
      return;
    }
    // Use the uploaded file's name as the asset's public ID and
    // allow overwriting the asset with new versions
    const options = {
      unique_filename: true,
      overwrite: true,
    };

    try {
      // Upload image to cloudinary
      const cloudinaryResponse = await cloudinary.uploader.upload(
        file64.content,
        options
      );

      if (!cloudinaryResponse) {
        return response.status(422).json({ error: "unable to change photo" });
      }

      // Get Userdata
      const userdata = await User.findById(_id);

      if (!userdata) {
        return response.status(422).json({ error: "unable to change photo" });
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

      return response.status(200).json({ message: data.profilePhoto });
    } catch (error) {
      return response.status(500).json({ error: "unable to change photo" });
    }
  }
);

// See other user's profile
router.get("/v1/user/:username", authorization, async (request, response) => {
  const username = request.params.username;

  try {
    const userData = await User.findOne(
      { username },
      "-email -password -logInActivity -isDeactivated" // Get all the fields except these
    ).populate("following followers", "-_id username");

    if (userData == null) {
      return response.status(401).json({ data: "no user found" });
    }

    let posts = await Post.find({ author: userData._id })
      .populate("author", "_id username profilePhoto")
      .populate("likes", "-_id username")
      .populate("photo", "-_id url");

    posts = posts.map((post) => {
      // Check if the current login user has liked the post or not?
      const liked = post.likes.some(
        (like) => like.username === request.user.username
      );
      return { ...post.toObject(), adminLiked: liked };
    });

    return response.status(200).json({
      user: userData,
      posts: posts,
      isFollowedByAdmin: userData.followers.some(
        (e) => e.username === request.user.username
      ),
    });
  } catch (err) {
    return response.status(422).json({ error: err });
  }
});

// Follow users
router.put("/v1/follow/:username", authorization, async (request, response) => {
  const { username } = request.params;
  try {
    const followedUser = await User.findOneAndUpdate(
      { username: username },
      {
        $addToSet: { followers: request.user._id },
      },
      { new: true }
    ).exec();

    if (followedUser) {
      var you = await User.findByIdAndUpdate(
        request.user._id,
        {
          $addToSet: { following: followedUser._id },
        },
        { new: true }
      )
        .select("-_id following followers")
        .exec();
    }
    return response.status(200).json({ data: you });
  } catch (error) {
    response.status(500).json({ error: "Failed to follow the user." });
  }
});

// Unfollow users
router.put(
  "/v1/unfollow/:username",
  authorization,
  async (request, response) => {
    const { username } = request.params;
    try {
      const unfollowedUser = await User.findOneAndUpdate(
        { username: username },
        {
          $pull: { followers: request.user._id },
        },
        { new: true }
      ).exec();

      if (unfollowedUser) {
        var you = await User.findByIdAndUpdate(
          request.user._id,
          {
            $pull: { following: unfollowedUser._id },
          },
          { new: true }
        )
          .select("-_id following followers")
          .exec();
      }

      return response.status(200).json({ data: you });
    } catch (error) {
      response.status(500).json({ error: err });
    }
  }
);

// search user
router.post("/search", (request, response) => {
  // "i" means ignoring case
  let pattern = new RegExp("^" + request.body.query, "i");

  User.find({ name: { $regex: pattern } })
    .select("_id, -password")
    .then((user) => {
      return response.json({ user });
    })
    .catch((err) => {
      return response.status(422).json({ err });
    });
});

// Get following users list
router.get(
  "/v1/:username/following",
  authorization,
  async (request, response) => {
    const { username } = request.params;
    try {
      const user = await User.findOne({ username: username }).exec();
      if (!user) {
        return response.status(422).json({ error: "failed to fetch data" });
      }
      const followingList = await User.find({ _id: user.following })
        .select("-_id name username profilePhoto")
        .exec();
      return response.status(200).json({ following: followingList });
    } catch (error) {
      return response.status(500).json({ error });
    }
  }
);

// Get followers list
router.get(
  "/v1/:username/followers",
  authorization,
  async (request, response) => {
    const { username } = request.params;
    try {
      const user = await User.findOne({ username: username }).exec();
      if (!user) {
        return response.status(422).json({ error: "failed to fetch data" });
      }
      const followingList = await User.find({ _id: user.followers })
        .select("-_id name username profilePhoto")
        .exec();
      return response.status(200).json({ followers: followingList });
    } catch (error) {
      return response.status(500).json({ error });
    }
  }
);

// Suggest Random User
router.get("/v1/suggestion/users", authorization, async (request, response) => {
  const { username } = request.user;

  try {
    let suggestedUsers = [];
    const data = await User.find({
      username: { $ne: request.user.username },
    }).select("-_id name username profilePhoto");

    if (data.length === 0) {
      return response
        .status(200)
        .json({ currentUser: { username }, suggestedUsers });
    }

    for (let i = 0; i < data.length; i++) {
      let randomIndex = Math.floor(Math.random() * data.length);
      suggestedUsers.push(data[randomIndex]);
    }

    response.status(200).json({ currentUser: { username }, suggestedUsers });
  } catch (error) {
    return response.status(500).json({ error });
  }
});

// Logout // Clear cookies
router.post("/v1/logout", (request, response) => {
  response.clearCookie("authorization");
  response.clearCookie("username");
  return response.end();
});

module.exports = router;
