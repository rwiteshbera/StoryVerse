const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = mongoose.model("Post");
const User = mongoose.model("User");
const requireLogin = require("../middleware/requireLogin");


// fetch logged in user data
router.get("/me", requireLogin, (req, res) => {
  const {name, followers, following, profilePhoto} = req.user;
  return res.json({name, followers, following, profilePhoto});
})

// Change Profile Photo
router.patch("/change_profile_pic", requireLogin, (req, res) => {
  User.findByIdAndUpdate(req.user._id, {profilePhoto: req.body.profilePicURL}, {new: true}, (err, result) => {
    if(err) {
      return res.status(422).json({error: err});
    } else {
      // console.log(result)
      return res.json({message: result});
    }
  })
})

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

// Follow and Unfollow features
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
        const {password , ...rest} = result;
        return res.json(rest._doc);
      })
      .catch((err) => {
        return res.status(422).json({ error: err });
      });
  });
});

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
        const {password , ...rest} = result;
        return res.json(rest._doc);
      })
      .catch((err) => {
        return res.status(422).json({ error: err });
      });
  });
});

module.exports = router;
