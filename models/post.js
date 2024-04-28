const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: { type: String, required: true, minLength: 1, maxLength: 40 },  
  text: { type: String, required: true, minLength: 1, maxLength: 500 },
  author: { type: Schema.Types.ObjectId, ref: "User", }
}, { timestamps: true });

PostSchema.virtual("url").get(function () {
  return `/post/${this._id}`;
});

PostSchema.virtual("createdAt_formatted").get(function () {
  return DateTime.fromJSDate(this.createdAt).toLocaleString(DateTime.DATETIME_MED);
});

// Export model
module.exports = mongoose.model("Post", PostSchema);