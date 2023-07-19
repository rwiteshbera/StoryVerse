const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const postSchema = new mongoose.Schema({
  photo: {
    type: ObjectId,
    ref: "Photo",
    require: true,
  },
  captions: {
    type: String,
    default: "",
  },
  likes: [{ type: ObjectId, ref: "User" }],
  author: {
    type: ObjectId,
    ref: "User", // User model object
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

mongoose.model("Post", postSchema);
