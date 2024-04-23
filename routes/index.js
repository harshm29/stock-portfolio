const express = require("express");
const router = express.Router();

const commonMethod = require("../utility/common");
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

  return router;
};
