const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: { type: String, required: true, minLength: 3, maxLength: 40 },
  last_name: { type: String, required: true, minLength: 3, maxLength: 40 },
  username: { type: String, required: true, minLength: 3, maxLength: 40 },
  password: { type: String, required: true, minLength: 3, maxLength: 200 },
  membership_status: { type:Boolean },
  admin: { type:Boolean },
});

UserSchema.virtual("url").get(function () {
  return `/user/${this._id}`;
});

UserSchema.virtual("full_name").get(function () {
  return `${this.first_name} ${this.last_name}`;
});

// Export model
module.exports = mongoose.model("User", UserSchema);