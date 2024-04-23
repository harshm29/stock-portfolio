const Stock = require("../models/Stock");

exports.getStokes = async (req, res) => {
  try {
    const result = await Stock.find();

    if (!result || result.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Stocks not found." });
    }

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error in fetching stocks:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
