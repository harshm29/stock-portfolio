const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema(
  {
    poll_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "polls",
      required: true,
    },
    nominee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "nominees",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    // Assuming you have a User collection
  },
  { timestamps: true }
);

const Votes = mongoose.model("votes", voteSchema);

module.exports = Votes;
