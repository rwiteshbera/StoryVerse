const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;

const postSchema = new mongoose.Schema({
    photo: {
        type: String,
        required: true
    },
    captions: {
        type: String,
        required: true
    },
    likes: [{type: ObjectId, ref: "User"}],
    postedBy: {
        type: ObjectId,
        ref: 'User', // User model object
        required: true
    }
})

mongoose.model("Post", postSchema);
