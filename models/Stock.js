// Import Mongoose
const mongoose = require("mongoose");

// Create a Stock Schema
const stockSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      // You can add any other validations or default values here
    },
  },
  { timestamps: true }
);

// Create and export the Stock model
const Stock = mongoose.model("Stock", stockSchema);
module.exports = Stock;
