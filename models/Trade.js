/**
 * @swagger
 * components:
 *   schemas:
 *     Trade:
 *       type: object
 *       required:
 *         - user_id
 *         - stock_id
 *         - date
 *         - price
 *         - type
 *         - quantity
 *       properties:
 *         user_id:
 *           type: string
 *           description: The ID of the user associated with the trade.
 *         stock_id:
 *           type: string
 *           description: The ID of the stock associated with the trade.
 *         date:
 *           type: string
 *           format: date
 *           description: The date of the trade.
 *         price:
 *           type: number
 *           description: The price of the trade.
 *         type:
 *           type: string
 *           enum: [buy, sell]
 *           description: The type of the trade (buy or sell).
 *         quantity:
 *           type: number
 *           description: The quantity of shares for the trade.
 */

const mongoose = require("mongoose");

// Create a Trade Schema
const tradeSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    stock_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stock",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["buy", "sell"],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

// Create and export the Trade model
const Trade = mongoose.model("trades", tradeSchema);
module.exports = Trade;
