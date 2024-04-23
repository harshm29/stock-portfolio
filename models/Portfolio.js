// Import Mongoose
const mongoose = require("mongoose");
// Create a Portfolio Schema
const portfolioSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },

    stock_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "stocks",
    },

    trade_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "trades",
    },
  },
  { timestamps: true }
);

// Create and export the Portfolio model
const Portfolio = mongoose.model("portfolios", portfolioSchema);
module.exports = Portfolio;
