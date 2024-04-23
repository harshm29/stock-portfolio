const express = require("express");
const router = express.Router();
const PortfolioController = require("../controllers/portfolioController");
const commonMethod = require("../utility/common");
module.exports = function (passport) {
  const isUser = async (req, res, next) => {
    let token = req.headers["authorization"];
    var decoded = await commonMethod.userTokenValidate(token);
    if ("isSuccess" in decoded) {
      res.send(decoded);
      return;
    } else {
      next();
    }
  };

  router.get("/", isUser, PortfolioController.getPortfolio);

  router.get("/holdings", isUser, PortfolioController.getHoldings);

  router.get("/returns", isUser, PortfolioController.getReturns);

  router.post("/addTrade", isUser, PortfolioController.addTrade);

  router.put("/updateTrade/:id", isUser, PortfolioController.updateTrade);

  router.delete("/removeTrade/:id", isUser, PortfolioController.removeTrade);

  return router;

  /**
   * @swagger
   * tags:
   *   name: Portfolio
   *   description: Operations related to user portfolios
   */

  /**
   * @swagger
   * /api/portfolio:
   *   get:
   *     summary: Get portfolio with pagination
   *     description: Retrieve the entire portfolio with trades, supports pagination.
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *         description: The page number for pagination (default is 1).
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *         description: The maximum number of records per page (default is 10).
   *     responses:
   *       '200':
   *         description: Successful operation. Returns the portfolio data with pagination details.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   description: Indicates if the operation was successful.
   *                 data:
   *                   type: array
   *                   description: Array of portfolio data with trades.
   *                 pagination:
   *                   type: object
   *                   properties:
   *                     total:
   *                       type: integer
   *                       description: Total number of portfolio records.
   *                     currentPage:
   *                       type: integer
   *                       description: Current page number.
   *                     totalPages:
   *                       type: integer
   *                       description: Total number of pages based on the limit.
   *                     perPage:
   *                       type: integer
   *                       description: Maximum number of records per page.
   *       '400':
   *         description: Bad request. Indicates invalid query parameters.
   *       '401':
   *         description: Unauthorized. Bearer token is missing or invalid.
   *       '404':
   *         description: Portfolio not found. No data available for the requested page.
   *       '500':
   *         description: Internal server error. Something went wrong on the server side.
   */

  /**
   * @swagger
   * /api/portfolio/holdings:
   *   get:
   *     summary: Get holdings in an aggregate view
   *     description: Fetches the aggregate view of user holdings
   *     tags:
   *       - Portfolio
   *     security:
   *       - BearerAuth: []
   *     responses:
   *       '200':
   *         description: Successful response
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       symbol:
   *                         type: string
   *                       quantity:
   *                         type: number
   *                       value:
   *                         type: number
   *       '401':
   *         description: Unauthorized request
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: Unauthorized
   *       '500':
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: Internal Server Error
   */

  /**
   * @swagger
   * /api/portfolio/returns:
   *   get:
   *     summary: Get cumulative returns
   *     description: Fetches cumulative returns for the user's portfolio
   *     tags:
   *       - Portfolio
   *     security:
   *       - BearerAuth: []
   *     responses:
   *       '200':
   *         description: Successful response
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: object
   *                   properties:
   *                     cumulativeReturns:
   *                       type: number
   *                       format: float
   *                       example: 15.2
   *       '401':
   *         description: Unauthorized request
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: Unauthorized
   *       '500':
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: Internal Server Error
   */

  /**
   * @swagger
   * /api/portfolio/addTrade:
   *   post:
   *     summary: Add a trade to the portfolio
   *     description: Add a new trade to the portfolio with the provided trade information.
   *     tags:
   *       - Portfolio
   *     security:
   *       - BearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               stockId:
   *                 type: string
   *                 description: The ID of the stock for the trade.
   *               price:
   *                 type: number
   *                 description: The price of the trade.
   *               type:
   *                 type: string
   *                 description: The type of the trade (buy or sell).
   *                 enum: [buy, sell]
   *               quantity:
   *                 type: number
   *                 description: The quantity of shares for the trade.
   *     responses:
   *       '200':
   *         description: Successful operation. Returns the added trade data.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   description: Indicates if the operation was successful.
   *                 data:
   *                   type: object
   *                   description: The added trade data.
   *       '400':
   *         description: Bad request. Indicates invalid request data.
   *       '401':
   *         description: Unauthorized. Bearer token is missing or invalid.
   *       '500':
   *         description: Internal server error. Something went wrong on the server side.
   */

  /**
   * @swagger
   * /api/portfolio/updateTrade/{id}:
   *   put:
   *     summary: Update a trade
   *     description: Update an existing trade with the specified ID.
   *     tags:
   *       - Portfolio
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         description: ID of the trade to update
   *         required: true
   *         schema:
   *           type: string
   *       - in: header
   *         name: Authorization
   *         description: Bearer token for authentication
   *         required: true
   *         schema:
   *           type: string
   *       - in: body
   *         name: trade
   *         description: Trade details to update
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 price:
   *                   type: number
   *                   format: float
   *                 type:
   *                   type: string
   *                   enum: [buy, sell]
   *                 quantity:
   *                   type: number
   *                   format: float
   *     responses:
   *       '200':
   *         description: Trade updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: object
   *                   properties:
   *                     _id:
   *                       type: string
   *                       example: "60ff7b21507f3054e36d632f"
   *                     price:
   *                       type: number
   *                       format: float
   *                       example: 100.5
   *                     type:
   *                       type: string
   *                       enum: [buy, sell]
   *                       example: "buy"
   *                     quantity:
   *                       type: number
   *                       format: float
   *                       example: 10
   *       '404':
   *         description: Trade not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Trade not found"
   *       '500':
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: Internal Server Error
   */

  /**
   * @swagger
   * /api/portfolio/removeTrade/{id}:
   *   delete:
   *     summary: Remove a trade
   *     description: Remove an existing trade with the specified ID.
   *     tags:
   *       - Portfolio
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         description: ID of the trade to remove
   *         required: true
   *         schema:
   *           type: string
   *       - in: header
   *         name: Authorization
   *         description: Bearer token for authentication
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       '200':
   *         description: Trade removed successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Trade removed successfully"
   *       '404':
   *         description: Trade not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Trade not found"
   */
};
