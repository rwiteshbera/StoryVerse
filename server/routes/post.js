const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = mongoose.model("Post");
const Photo = mongoose.model("Photo");
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
router.get("/v1/feed", authorization, async (request, response) => {
  try {
    const loginUserData = await User.findOne({ _id: request.user._id });

    let feedPosts = await Post.find({
      author: { $in: loginUserData.following },
    })
      .populate("author", "-_id username profilePhoto")
      .populate("likes", "-_id username")
      .populate("photo", "-_id url");

    feedPosts = feedPosts.map((post) => {
      // Check if the current login user has liked the post or not?
      const liked = post.likes.some(
        (like) => like.username === request.user.username
      );
      return { ...post.toObject(), adminLiked: liked };
    });

    return response.status(200).json({ message: feedPosts });
  } catch (error) {
    return response.status(500).json({ error: "failed to load posts" });
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
  async (request, response) => {
    if (!request.file) {
      return response
        .status(200)
        .json({ message: "Input field shouldn't be empty." });
    }

    const extname = path.extname(request.file.originalname).toString();
    const file64 = parser.format(extname, request.file.buffer);

    if (
      extname !== ".jpeg" &&
      extname !== ".png" &&
      extname !== ".jpg" &&
      extname !== ".webp"
    ) {
      response
        .status(415)
        .json({
          extension: extname,
          message: "only jpeg, jpg, png, webp files are allowed",
        });
      return;
    }

    try {
      // Upload image to cloudinary
      const cloudinaryResponse = await cloudinary.uploader.upload(
        file64.content,
        {
          unique_filename: true,
          overwrite: true,
          allowed_formats: ["jpg", "png", "jpeg", "webp"],
          folder: request.user._id,
          image_metadata: true,
        }
      );

      if (!cloudinaryResponse) {
        return response.status(422).json({ error: "unable to post" });
      }

      // Upload cloudinary response to Photo
      const photo = new Photo({
        url: cloudinaryResponse.secure_url,
        asset_id: cloudinaryResponse.asset_id,
        public_id: cloudinaryResponse.public_id,
        folder: cloudinaryResponse.folder,
        version: cloudinaryResponse.version,
        created_at: cloudinaryResponse.created_at,
      });

      // Save the Photo document to the database
      const savedPhoto = await photo.save();

      const post = new Post({
        captions: request.body.caption,
        photo: savedPhoto,
        author: request.user,
      });

      const uploadPhotoRes = await post.save();

      return response.status(200).json({ message: uploadPhotoRes });
    } catch (error) {
      return response.status(500).json({ error: error });
    }
  }
);

// All the post created by the logged-in user
router.get("/v1/user/posts", authorization, async (request, response) => {
  try {
    let posts = await Post.find({ author: request.user._id })
      .populate("author", "-_id username profilePhoto")
      .populate("likes", "-_id username")
      .populate("photo", "-_id url");

    posts = posts.map((post) => {
      // Check if the current login user has liked the post or not?
      const liked = post.likes.some(
        (like) => like.username === request.user.username
      );
      return { ...post.toObject(), adminLiked: liked };
    });

    return response.status(200).json({ message: posts });
  } catch (error) {
    return response.status(500).json({ error: "unable to load posts" });
  }
});

// Like button
router.put("/v1/like/check", authorization, async (request, response) => {
  let { id } = request.query;

  try {
    const data = await Post.findByIdAndUpdate(
      id,
      {
        $addToSet: { likes: request.user._id },
      },
      { new: true }
    ).exec();

    return response.status(200).json({ message: data });
  } catch (error) {
    return response.status(422).json({ error: error });
  }
});

// Uncheck Like button
router.put("/v1/like/uncheck", authorization, async (request, response) => {
  let { id } = request.query;

  try {
    const data = await Post.findByIdAndUpdate(
      id,
      {
        $pull: { likes: request.user._id },
      },
      { new: true }
    ).exec();

    return response.status(200).json({ message: data });
  } catch (error) {
    return response.status(422).json({ error: error });
  }
});

// delete your own post
router.delete("/v1/post/", authorization, async (request, response) => {
  const postId = request.query.id;
  try {
    const data = await Post.findByIdAndDelete(postId).populate(
      "photo",
      "_id public_id"
    );

    // Remove Previous Image From Cloudinary
    await cloudinary.uploader.destroy(data.photo?.public_id);

    response.status(200).json({ message: data, isDeleted: true });
  } catch (error) {
    return response.status(200).json({ message: error, isDeleted: false });
  }
});

module.exports = router;
