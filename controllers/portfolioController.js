const mongoose = require("mongoose");
const Validator = require("validatorjs");
const Trade = require("../models/Trade");
const Portfolio = require("../models/Portfolio");
const Stock = require("../models/Stock");

const commonMethod = require("../utility/common");

exports.getPortfolio = async (req, res) => {
  try {
    const token = req.headers["authorization"];
    const decoded = await commonMethod.userTokenValidate(token);

    if ("isSuccess" in decoded) {
      return res.status(401).json(decoded);
    }

    const user_id = decoded.id;
    const { page, limit } = req.query;

    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;

    const skip = (pageNumber - 1) * limitNumber;

    const Stocks = await Trade.find({
      user_id: new mongoose.Types.ObjectId(user_id),
    });

    const uniqueIdsSet = new Set(
      Stocks.map((stock) => new mongoose.Types.ObjectId(stock.stock_id))
    );

    const uniqueIdsArray = Array.from(uniqueIdsSet);

    // Aggregation pipeline stages
    const pipeline = [
      { $match: { _id: { $in: uniqueIdsArray } } },

      {
        $lookup: {
          from: "trades", // Assuming "stocks" is the collection name
          let: { stockId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$stock_id", "$$stockId"] } } },
            { $sort: { createdAt: -1 } }, // Sort trades by createdAt in descending order
          ],
          as: "trades",
        },
      },

      { $sort: { createdAt: -1 } },
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limitNumber }],
          totalCount: [{ $count: "total" }],
        },
      },
      { $unwind: { path: "$totalCount", preserveNullAndEmptyArrays: true } },
    ];

    // Execute the aggregation pipeline
    const [result] = await Stock.aggregate(pipeline);

    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Portfolio not found." });
    }

    let { data, totalCount } = result;

    // Calculate total pages based on total count and limit
    const total = totalCount ? totalCount.total : 0;
    const totalPages = Math.ceil(total / limitNumber);

    return res.status(200).json({
      success: true,
      data: data,
      pagination: {
        total: total,
        currentPage: pageNumber,
        totalPages: totalPages,
        perPage: limitNumber,
      },
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getHoldings = async (req, res) => {
  try {
    const token = req.headers["authorization"];
    const decoded = await commonMethod.userTokenValidate(token);

    if ("isSuccess" in decoded) {
      return res.status(401).json(decoded);
    }

    const user_id = decoded.id;

    const pipeline = [
      { $match: { user_id: new mongoose.Types.ObjectId(user_id) } },
      { $sort: { createdAt: -1 } }, // Sort by createdAt in descending order
      {
        $lookup: {
          from: "stocks",
          localField: "stock_id",
          foreignField: "_id",
          as: "stock_info",
        },
      },
      { $unwind: "$stock_info" },
      {
        $group: {
          _id: "$stock_id",
          totalQuantity: {
            $sum: {
              $cond: [
                { $eq: ["$type", "buy"] },
                "$quantity",
                { $multiply: ["$quantity", -1] },
              ],
            },
          },
          totalValue: {
            $sum: {
              $cond: [
                { $eq: ["$type", "buy"] },
                { $multiply: ["$quantity", "$price"] },
                {
                  $multiply: [{ $multiply: ["$quantity", -1] }, "$price"],
                },
              ],
            },
          },
          lastTradeDate: { $max: "$createdAt" },
          stock_info: { $first: "$stock_info" },
        },
      },
      {
        $project: {
          _id: 1,
          user_id: user_id,
          stock_id: "$_id",
          quantity: "$totalQuantity",
          avg: {
            $cond: [
              { $eq: ["$totalQuantity", 0] },
              0,
              { $divide: ["$totalValue", "$totalQuantity"] },
            ],
          },
          stock: "$stock_info.id",
        },
      },
      {
        $project: {
          _id: 1,
          user_id: 1,
          stock_id: 1,
          quantity: 1,
          avg: { $round: ["$avg", 2] }, // Round to two decimal places
          stock: 1,
        },
      },
    ];

    // Execute the aggregation pipeline
    const holdings = await Trade.aggregate(pipeline);

    if (holdings.length > 0) {
      return res.status(200).json({
        success: true,
        data: holdings,
        message: "founded holdings",
      });
    } else {
      return res.status(201).json({
        success: false,
        message: "not founded holdings",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* getReturns logic
    First, let’s compute the total cost for each transaction:

      BUY 1: Cost = 100 shares × 900 = 90,000
      SELL: The 50 shares sold do not affect the total cost.
      BUY 2: Cost = 100 shares × 850 = 85,000

      Next, let’s calculate the total shares and total cost:

      Total shares = 100 (initial) - 50 (sold) + 100 (bought) = 150 shares
      Total cost = 90,000 (initial) - 85,000 (bought) = 5,000

      Finally, the average cost per share is:
      Average Cost=Total SharesTotal Cost​=1505000​=833.33
      Therefore, the average cost of the RELIANCE stock is approximately 833.33 per share.
     */
exports.getReturns = async (req, res) => {
  try {
    const token = req.headers["authorization"];
    const decoded = await commonMethod.userTokenValidate(token);

    if ("isSuccess" in decoded) {
      return res.status(401).json(decoded);
    }

    const user_id = decoded.id;

    const pipeline = [
      { $match: { user_id: new mongoose.Types.ObjectId(user_id) } },
      { $sort: { createdAt: -1 } }, // Sort by createdAt in descending order
      {
        $lookup: {
          from: "stocks",
          localField: "stock_id",
          foreignField: "_id",
          as: "stock_info",
        },
      },
      { $unwind: "$stock_info" },
      {
        $group: {
          _id: "$stock_id",
          totalQuantity: {
            $sum: {
              $cond: [
                { $eq: ["$type", "buy"] },
                "$quantity",
                { $multiply: ["$quantity", -1] },
              ],
            },
          },
          totalValue: {
            $sum: {
              $cond: [
                { $eq: ["$type", "buy"] },
                { $multiply: ["$quantity", "$price"] },
                {
                  $multiply: [{ $multiply: ["$quantity", -1] }, "$price"],
                },
              ],
            },
          },
          lastTradeDate: { $max: "$createdAt" },
          stock_info: { $first: "$stock_info" },
        },
      },
      {
        $project: {
          _id: 1,
          user_id: user_id,
          stock_id: "$_id",
          quantity: "$totalQuantity",
          avg: {
            $cond: [
              { $eq: ["$totalQuantity", 0] },
              0,
              { $divide: ["$totalValue", "$totalQuantity"] },
            ],
          },
          stock: "$stock_info.id",
          lastTradeDate: 1,
        },
      },
      {
        $project: {
          _id: 1,
          user_id: 1,
          stock_id: 1,
          quantity: 1,
          avg: { $round: ["$avg", 2] }, // Round to two decimal places
          stock: 1,
          lastTradeDate: 1,
        },
      },
    ];

    // Execute the aggregation pipeline
    const holdings = await Trade.aggregate(pipeline);

    // Calculate returns
    const returns = holdings.map((holding) => {
      const cumulativeReturn =
        holding.avg !== 0 ? (100 - holding.avg) / holding.avg : 0;
      return {
        _id: holding._id,
        user_id: holding.user_id,
        stock_id: holding.stock_id,
        stock: holding.stock,
        trade_date: holding.lastTradeDate,
        average: holding.avg,
        cumulativeReturn: cumulativeReturn.toFixed(2),
      };
    });

    if (holdings.length > 0) {
      return res.status(200).json({
        success: true,
        data: returns,
        message: "Returns calculated successfully",
      });
    } else {
      return res.status(201).json({
        success: false,
        message: "No holdings found",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Add a trade
exports.addTrade = async (req, res) => {
  try {
    const token = req.headers["authorization"];
    const decoded = await commonMethod.userTokenValidate(token);

    if ("isSuccess" in decoded) {
      return res.status(401).json(decoded);
    }

    const { stockId, price, type, quantity } = req.body;

    const rules = {
      stockId: "required",
      price: "required|numeric",
      type: "required|in:buy,sell",
      quantity: "required|numeric",
    };

    const validation = new Validator(req.body, rules);

    if (validation.fails()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.errors.errors,
      });
    }

    const date = new Date();

    const tradeInfo = {
      user_id: new mongoose.Types.ObjectId(decoded.id),
      stock_id: new mongoose.Types.ObjectId(stockId),
      date: date,
      price: price,
      type: type,
      quantity: quantity,
    };

    const trade = await Trade.create(tradeInfo);

    if (trade) {
      await Portfolio.create({
        user_id: new mongoose.Types.ObjectId(decoded.id),
        stock_id: new mongoose.Types.ObjectId(stockId),
        trade_id: new mongoose.Types.ObjectId(trade._id),
      });

      return res.status(201).json({ success: true, data: trade });
    } else {
      return res.status(500).json({
        success: false,
        message: "Failed to create trade.",
      });
    }
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateTrade = async (req, res) => {
  try {
    const token = req.headers["authorization"];
    const decoded = await commonMethod.userTokenValidate(token);

    if ("isSuccess" in decoded) {
      return res.status(401).json(decoded);
    }

    const { id } = req.params;
    const { price, type, quantity } = req.body;

    // Validation rules for update
    const rules = {
      price: "required|numeric",
      type: "required|in:buy,sell",
      quantity: "required|numeric",
    };

    const validation = new Validator(req.body, rules);

    if (validation.fails()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.errors.errors,
      });
    }

    const user_id = decoded.id;

    // Check if the trade belongs to the authenticated user
    const trade = await Trade.findOne({
      _id: new mongoose.Types.ObjectId(id),
      user_id: new mongoose.Types.ObjectId(user_id),
    });

    if (!trade) {
      return res.status(404).json({
        success: false,
        message: "Trade not found or does not belong to the user",
      });
    }

    // Update the trade
    const updatedTrade = await Trade.findByIdAndUpdate(
      new mongoose.Types.ObjectId(id),
      { quantity, price, type },
      { new: true }
    );

    return res.status(200).json({ success: true, data: updatedTrade });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Remove a trade
exports.removeTrade = async (req, res, next) => {
  try {
    const token = req.headers["authorization"];
    const decoded = await commonMethod.userTokenValidate(token);

    if ("isSuccess" in decoded) {
      return res.status(401).json(decoded);
    }

    const user_id = decoded.id;
    const { id } = req.params;

    // Check if the trade belongs to the authenticated user
    const trade = await Trade.findOne({
      _id: new mongoose.Types.ObjectId(id),
      user_id: new mongoose.Types.ObjectId(user_id),
    });

    if (!trade) {
      return res.status(404).json({
        success: false,
        message: "Trade not found or does not belong to the user",
      });
    }

    // Remove the trade
    const deletedTrade = await Trade.findByIdAndDelete(id);

    if (deletedTrade) {
      return res
        .status(200)
        .json({ success: true, message: "Trade removed successfully" });
    } else {
      return res.status(404).json({
        success: false,
        message: "Trade not removed successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
