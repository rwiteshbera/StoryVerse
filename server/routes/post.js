const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = mongoose.model("Post");
const requireLogin = require('../middleware/requireLogin')


router.post('/createPost', requireLogin, (req, res) => {
    const {captions} = req.body;
    if(!captions) {
        return res.status(422).json({error: "Please add a description"})
    }
    console.log(req.user)
    const post = new Post({
        captions: captions,
        postedBy: req.user.name
    })

    post.save()
    .then(()=> {
        res.json({message: "Posted successfully"})
    }).catch((err) => {
        res.status(401).json({err})
    })
})


module.exports = router;