const mongoose = require("mongoose");

CLOUDINARY_NAME = process.env.CLOUDINARY_NAME;

const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePhoto: {
    type: String,
    default: `https://res.cloudinary.com/${CLOUDINARY_NAME}/image/upload/v1662910341/DefaultProfilePhoto/blank-profile-picture-973460_1280_veumtr.png`,
  },
  gender: {
    type: String,
    default: "",
  },
  following: [{ type: ObjectId, ref: "User" }],
  followers: [{ type: ObjectId, ref: "User" }],
  logInActivity: [{ type: String, required: true }],
  isDeactivated: {
    type: Boolean,
    default: false,
    required: true,
  },
});

mongoose.model("User", userSchema);
