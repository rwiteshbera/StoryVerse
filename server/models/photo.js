const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const photoSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  asset_id: {
    type: String,
    require: true,
  },
  public_id: {
    type: String,
    require: true,
  },
  folder: {
    type: ObjectId,
    ref: "User",
    required: true,
  },
  version: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    required: true,
  },
});

mongoose.model("Photo", photoSchema);


