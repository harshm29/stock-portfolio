// routes.js
const express = require("express");
const router = express.Router();
const pollController = require("../controllers/pollController");
const commonMethod = require("../utility/common");
const isAdmin = async (req, res, next) => {
  let token = req.headers["authorization"];
  console.log(token);
  var decoded = await commonMethod.adminTokenValidate(token);
  if ("isSuccess" in decoded) {
    res.send(decoded);
    return;
  } else {
    next();
  }
};

module.exports = function (passport) {
  /**
   * @swagger
   * /poll/create:
   *   post:
   *     summary: Create a new poll
   *     description: Create a new poll with the specified question and list of nominees.
   *     tags:
   *       - Polls
   *     security:
   *       - AdminAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               question:
   *                 type: string
   *                 description: The question for the poll.
   *               nominees:
   *                 type: array
   *                 description: List of nominees for the poll.
   *                 items:
   *                   type: string
   *     responses:
   *       '201':
   *         description: Poll created successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 isSuccess:
   *                   type: boolean
   *                   description: Indicates if the poll creation was successful.
   *                 data:
   *                   type: object
   *                   description: Object containing the created poll and its nominees.
   *                 message:
   *                   type: string
   *                   description: A success message indicating the poll was created successfully.
   */

  router.post("/create", isAdmin, pollController.createPoll);
  /**
   * @swagger
   * /poll/list:
   *   get:
   *     summary: Get a list of polls
   *     description: Retrieve a list of all polls available in the system.
   *     tags:
   *       - Polls
   *     security:
   *       - AdminAuth: []
   *     responses:
   *       '200':
   *         description: A list of polls retrieved successfully.
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
   *                   description: List of polls.
   *                   items:
   *                     type: object
   *                     properties:
   *                       _id:
   *                         type: string
   *                         description: The ID of the poll.
   *                       question:
   *                         type: string
   *                         description: The question of the poll.
   *                       createdAt:
   *                         type: string
   *                         format: date-time
   *                         description: The date and time when the poll was created.
   *       '401':
   *         description: Unauthorized access. User is not authorized to access this endpoint.
   *       '500':
   *         description: Internal server error. Something went wrong on the server side.
   */

  router.get("/list", isAdmin, pollController.listPolls);

  /**
   * @swagger
   * /poll/update-poll/{id}:
   *   put:
   *     summary: Update a poll
   *     description: Update the question of a specific poll identified by its ID.
   *     tags:
   *       - Polls
   *     security:
   *       - AdminAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: The ID of the poll to update.
   *       - in: query
   *         name: question
   *         schema:
   *           type: string
   *         description: The updated question for the poll.
   *     responses:
   *       '200':
   *         description: Poll updated successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 isSuccess:
   *                   type: boolean
   *                   description: Indicates if the poll update was successful.
   *                 message:
   *                   type: string
   *                   description: A success message indicating the poll was updated successfully.
   *       '400':
   *         description: Bad request. The request is missing required parameters or has invalid data.
   *       '401':
   *         description: Unauthorized access. User is not authorized to access this endpoint.
   *       '404':
   *         description: Poll not found. The specified poll ID does not exist in the system.
   *       '500':
   *         description: Internal server error. Something went wrong on the server side.
   */

  router.put("/update-poll/:id", isAdmin, pollController.updatePoll);
  /**
   * @swagger
   * /poll/view/{id}:
   *   get:
   *     summary: Get a poll by ID
   *     description: Retrieve a specific poll by its ID.
   *     tags:
   *       - Polls
   *     security:
   *       - AdminAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: The ID of the poll to retrieve.
   *     responses:
   *       '200':
   *         description: Poll retrieved successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 isSuccess:
   *                   type: boolean
   *                   description: Indicates if the poll retrieval was successful.
   *                 data:
   *                   type: object
   *                   description: The retrieved poll data.
   *                 message:
   *                   type: string
   *                   description: A success message indicating the poll was retrieved successfully.
   *       '400':
   *         description: Bad request. The request is missing required parameters or has invalid data.
   *       '401':
   *         description: Unauthorized access. User is not authorized to access this endpoint.
   *       '404':
   *         description: Poll not found. The specified poll ID does not exist in the system.
   *       '500':
   *         description: Internal server error. Something went wrong on the server side.
   */

  router.get("/view/:id", isAdmin, pollController.viewPollById);

  /**
   * @swagger
   * /poll/create-nominee:
   *   post:
   *     summary: Create a new nominee for a poll
   *     description: Create a new nominee for an existing poll identified by its ID.
   *     tags:
   *       - Polls
   *     security:
   *       - AdminAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               pollId:
   *                 type: string
   *                 description: The ID of the poll to add the nominee to.
   *               name:
   *                 type: string
   *                 description: The name of the new nominee.
   *     responses:
   *       '201':
   *         description: Nominee created successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 isSuccess:
   *                   type: boolean
   *                   description: Indicates if the nominee creation was successful.
   *                 data:
   *                   type: object
   *                   description: The created nominee data.
   *                 message:
   *                   type: string
   *                   description: A success message indicating the nominee was created successfully.
   *       '400':
   *         description: Bad request. The request is missing required parameters or has invalid data.
   *       '401':
   *         description: Unauthorized access. User is not authorized to access this endpoint.
   *       '500':
   *         description: Internal server error. Something went wrong on the server side.
   */

  router.post("/create-nominee", isAdmin, pollController.createNominee);

  /**
   * @swagger
   * /poll/update-nominees:
   *   put:
   *     summary: Update existing nominees for a poll
   *     description: Update the names of existing nominees for a poll identified by their IDs.
   *     tags:
   *       - Polls
   *     security:
   *       - AdminAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               id:
   *                 type: string
   *                 description: List of IDs of nominees to update.
   *                 items:
   *                   type: string
   *               name:
   *                 type: string
   *                 description: List of new names for the corresponding nominees.
   *                 items:
   *                   type: string
   *     responses:
   *       '200':
   *         description: Nominees updated successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 isSuccess:
   *                   type: boolean
   *                   description: Indicates if the nominees were updated successfully.
   *                 data:
   *                   type: array
   *                   description: The updated nominees data.
   *                   items:
   *                     type: object
   *                     properties:
   *                       _id:
   *                         type: string
   *                         description: The ID of the updated nominee.
   *                       name:
   *                         type: string
   *                         description: The updated name of the nominee.
   *                 message:
   *                   type: string
   *                   description: A success message indicating the nominees were updated successfully.
   *       '400':
   *         description: Bad request. The request is missing required parameters or has invalid data.
   *       '401':
   *         description: Unauthorized access. User is not authorized to access this endpoint.
   *       '500':
   *         description: Internal server error. Something went wrong on the server side.
   */

  router.put("/update-nominees", isAdmin, pollController.updateNominees);

  router.delete("/delete-nominee/:id", isAdmin, pollController.deleteNominee);
  /**
 * @swagger
 * /poll/delete-nominee/{id}:
 *   delete:
 *     summary: Delete a nominee by ID
 *     description: Delete a nominee from the system using its unique identifier.
 *     tags:
 *       - Polls
 *     security:
 *       - AdminAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the nominee to delete.
 *     responses:
 *       '200':
 *         description: Nominee deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                   description: Indicates if the nominee was deleted successfully.
 *                 message:
 *                   type: string
 *                   description: A success message indicating the nominee was deleted successfully.
 *       '400':
 *         description: Bad request. The request is missing required parameters or has invalid data.
 *       '401':
 *         description: Unauthorized access. User is not authorized to access this endpoint.
 *       '404':
 *         description: Nominee not found. The specified nominee ID does not exist in the system.
 *       '500':
 *         description: Internal server error.

 * /poll/nominees-chart/{pollId}:
 *   get:
 *     summary: Get chart data for nominees of a poll
 *     description: Get chart data for nominees of a poll based on the poll ID.
 *     tags:
 *       - Polls
 *     parameters:
 *       - in: path
 *         name: pollId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the poll to get nominees chart data for.
 *     responses:
 *       '200':
 *         description: Nominees chart data retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                   description: Indicates if the chart data retrieval was successful.
 *                 data:
 *                   type: object
 *                   description: Object containing chart data for nominees of the poll.
 *       '400':
 *         description: Bad request. The request is missing required parameters or has invalid data.
 *       '401':
 *         description: Unauthorized access. User is not authorized to access this endpoint.
 *       '404':
 *         description: Poll not found. The specified poll ID does not exist in the system.
 *       '500':
 *         description: Internal server error.
 */

  router.get("/nominees-chart", pollController.getNomineesChart);

  router.get("/nominees-chart-id/:id", pollController.getNomineesChartbyid);
  return router;
};
