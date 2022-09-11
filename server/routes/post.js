const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = mongoose.model("Post");
const requireLogin = require("../middleware/requireLogin");

// Get the posts of the users you follow
router.get("/feedPosts", requireLogin, (req, res) => {
  Post.find({ postedBy: { $in : req.user.following}})
    .populate("postedBy", "name email")
    .then((posts) => {
      res.json({ posts: posts });
    })
    .catch((err) => {
      console.log(err);
    });
});

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
      // console.log(myposts);
      // return res.json(myposts);
    })
    .catch((err) => {
      console.log(err);
    });
});

// Like and unlike
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

router.delete("/delete/:postId", requireLogin, (req, res) => {
  try {
    console.log(req.params.postId)
    const result = Post.findOne({_id: req.params.postId})
    .populate("postedBy", "_id")
    .exec((err, post)=> {
      if(err || !post) {
        return  console.log("ERROR")
      }
      post.remove()
      .then((result)=> {
        console.log(result)
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
