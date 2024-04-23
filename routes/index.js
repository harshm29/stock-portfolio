const express = require("express");
const router = express.Router();

const commonMethod = require("../utility/common");
const StokeController = require("../controllers/stokeController");
module.exports = function (passport) {
  /**
   * @swagger
   * /:
   *   get:
   *     summary: Get the index page
   *     description: Retrieves the index page with the title "Stock Portfolio API"
   *     responses:
   *       '200':
   *         description: Successful response with the index page rendered
   *         content:
   *           text/html:
   *             schema:
   *               type: string
   *       '404':
   *         description: Not Found - The requested resource is not found
   */

  router.get("/", function (req, res, next) {
    res.render("index", { title: "Stock Portfolio API" });
  });

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

  /**
   * @swagger
   * /stokes:
   *   get:
   *     summary: Get all stokes
   *     description: Retrieve a list of all stokes.
   *     tags:
   *       - Portfolio
   *     security:
   *     responses:
   *       200:
   *         description: Successful operation. Returns a list of stokes.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   description: Indicates if the request was successful.
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       _id:
   *                         type: string
   *                         description: The ID of the stoke.
   *                       name:
   *                         type: string
   *                         description: The name of the stoke.
   *                       price:
   *                         type: number
   *                         description: The price of the stoke.
   *       404:
   *         description: No stokes found.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   description: Indicates if no stokes were found.
   *                 message:
   *                   type: string
   *                   description: Error message indicating no stokes were found.
   */

  router.get("/stokes", StokeController.getStokes);

  return router;
};
