const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  googleId: String,
  email: String,
  thumbnail: String
});

const User = mongoose.model("user", userSchema);

module.exports = User;
