const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = mongoose.model("Post");
const requireLogin = require('../middleware/requireLogin')

router.get('/allPosts', (req, res) => {
    Post.find()
    .populate("postedBy", "name email")
    .then((posts) => {
        res.json({posts: posts})
    })
    .catch((err) => {
        console.log(err)
    })
})

router.post('/createPost', requireLogin, (req, res) => {
    const {captions} = req.body;
    if(!captions) {
        return res.status(422).json({error: "Please add a description"})
    }
    const post = new Post({
        captions: captions,
        postedBy: req.user
    })

    post.save()
    .then(()=> {
        res.json({message: "Posted successfully"})
    }).catch((err) => {
        res.status(401).json({err})
    })
})


// All the post created by that user
router.get('/mypost', requireLogin, (req, res) => {
    Post.find({postedBy: req.user._id})
    .then((res) => {
        console.log(res)
    })
    .catch((err) => {
        console.log(err)
    })
})

module.exports = router;