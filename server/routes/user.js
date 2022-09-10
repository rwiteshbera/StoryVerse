const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = mongoose.model("Post");
const User = mongoose.model("User");
const requireLogin = require("../middleware/requireLogin");

// See other user's profile
router.get('/user/:id', (req, res) => {
    User.findOne({_id: req.params.id})
    .select("-password") // Get all the fields except password
    .then((user) => {
        Post.find({postedBy: req.params.id})
        .populate("postedBy", "_id name")
        .exec((err, posts) => {
            if(err) {
                return res.status(422).json({error: err});
            }
            res.json({user, posts});
        })
    }).catch((err) => {
        return res.status(404).json({error: "User not found."});
    })
})

module.exports = router;
