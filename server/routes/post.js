const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = mongoose.model("Post");
const requireLogin = require("../middleware/requireLogin");

// Get the posts of the users you follow
router.get("/feedPosts", requireLogin, (req, res) => {
  Post.find({ postedBy: { $in : req.user.following}})
    .populate("postedBy", "name email profilePhoto")
    .then((posts) => {
      res.json({ posts: posts });
    })
    .catch((err) => {
      console.log(err);
    });
});

// Upload new image on socials
router.post("/upload", requireLogin, (req, res) => {
  try {
    const { captions, url } = req.body;
    if (!captions || !url) {
      return res.status(422).json({ error: "Please fill all the fields" });
    }
    const post = new Post({
      captions: captions,
      photo: url,
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
});


// All the post created by that user
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
    const result = Post.findOne({_id: req.params.postId})
    .populate("postedBy", "_id")
    .exec((err, post)=> {
      if(err || !post) {
        return  console.log("ERROR")
      }
      post.remove()
      .then((result)=> {
        return res.json(result)
      })
      .catch((error)=> {
        console.log(error)
      })
    })
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
