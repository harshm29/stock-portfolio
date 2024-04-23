const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: { type: String, maxLength: 100 },
    type: { type: String, default: "user", enum: ["admin", "user"] },
    email: { type: String, lowercase: true, unique: true, required: true },
    mobile: { type: String },
    dob: { type: Date },
    gender: { type: String, enum: ["M", "F", "T"] },
    password: { type: String },
    voter_id: { type: String },
  },
  { timestamps: true }
);

userSchema.index({ createdAt: 1, email: 1, type: 1 });

const User = mongoose.model("users", userSchema);

module.exports = User;
