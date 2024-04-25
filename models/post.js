const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: { type: String, required: true, minLength: 1, maxLength: 40 },
  time: { type: Date, required: true },
  text: { type: String, required: true, minLength: 1, maxLength: 500 },
});

PostSchema.virtual("url").get(function () {
  return `/post/${this._id}`;
});

// Export model
module.exports = mongoose.model("Post", PostSchema);