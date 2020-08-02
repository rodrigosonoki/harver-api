const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      min: 6,
      max: 255,
    },
    email: {
      type: String,
      required: true,
      min: 6,
      max: 255,
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 1024,
      select: false,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    avatar: {
      type: String,
      default: "https://api.adorable.io/avatars/40/abott@adorable.png",
    },
    role: {
      type: String,
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: 0,
    },
  },
  { collection: "users" }
);

module.exports = mongoose.model("User", userSchema);
