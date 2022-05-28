const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;

const postSchema = new mongoose.Schema({
    photo: {
        type: String,
        default: 'NO PHOTO'
    },
    captions: {
        type: String,
        required: true
    },
    postedBy: {
        type: String,
        ref: 'User', // User model object
        required: true
    }
})

mongoose.model("Post", postSchema);