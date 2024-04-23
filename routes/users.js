const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
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
  /**
   * @swagger
   * /user/registration:
   *   post:
   *     tags:
   *       - User Auth
   *     summary: User Registration
   *     description: Register a new user with required fields
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: "body"
   *         name: "user"
   *         description: "User registration data"
   *         required: true
   *         schema:
   *           type: object
   *           properties:
   *             type:
   *               type: string
   *               description: "User type (admin/user)"
   *             name:
   *               type: string
   *               description: "User name"
   *             email:
   *               type: string
   *               format: email
   *               description: "User email"
   *             mobile:
   *               type: string
   *               minLength: 8
   *               maxLength: 15
   *               description: "User mobile number"
   *             dob:
   *               type: string
   *               format: date
   *               description: "User date of birth (YYYY-MM-DD)"
   *             password:
   *               type: string
   *               description: "User password"
   *             voterid:
   *               type: string
   *               description: "User voter ID"
   *             gender:
   *               type: string
   *               enum:
   *                 - "M"
   *                 - "F"
   *                 - "T"
   *               description: "User gender"
   *     responses:
   *       200:
   *         description: User registered successfully. Please check your OTP in mail.
   *         schema:
   *           $ref: "#/definitions/userSchema"
   *       400:
   *         description: User not found in the database or invalid request.
   * definitions:
   *   userSchema:
   *     type: object
   *     properties:
   *       email:
   *         type: string
   *       gender:
   *         type: string
   *       dob:
   *         type: string
   *       name:
   *         type: string
   *       mobile:
   *         type: string
   *       status:
   *         type: string
   *     required:
   *       - name
   *       - mobile
   *       - type
   */

  router.post(`/registration`, UserController.Registration);

  /**
   * @swagger
   * /user/login:
   *   post:
   *     tags:
   *       - User Auth
   *     summary: User Login
   *     description: Login for existing users with email, password, and user type (admin/user)
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: body
   *         name: userCredentials
   *         description: User login credentials
   *         required: true
   *         schema:
   *           type: object
   *           properties:
   *             email:
   *               type: string
   *               format: email
   *               description: User email
   *             password:
   *               type: string
   *               description: User password
   *             type:
   *               type: string
   *               enum:
   *                 - user
   *                 - admin
   *               description: User type (admin/user)
   *     responses:
   *       200:
   *         description: User logged in successfully. Returns token and user details.
   *         schema:
   *           type: object
   *           properties:
   *             isSuccess:
   *               type: boolean
   *               description: Indicates if the login was successful.
   *             token:
   *               type: string
   *               description: Access token for the user session.
   *             userDetails:
   *               $ref: "#/definitions/userSchema"
   *             message:
   *               type: string
   *               description: Login success message.
   *       400:
   *         description: Invalid request or incorrect credentials.
   *         schema:
   *           type: object
   *           properties:
   *             isSuccess:
   *               type: boolean
   *               description: Indicates if the login was successful.
   *             message:
   *               type: string
   *               description: Error message indicating the reason for failure.
   * definitions:
   *   userSchema:
   *     type: object
   *     properties:
   *       email:
   *         type: string
   *         format: email
   *       gender:
   *         type: string
   *       dob:
   *         type: string
   *       name:
   *         type: string
   *       mobile:
   *         type: string
   *       status:
   *         type: string
   *     required:
   *       - name
   *       - mobile
   *       - type
   */

  router.post(`/login`, UserController.login);

  /**
   * @swagger
   * /user/forgotPassword:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - User Auth
   *     summary: User forgot password
   *     description: Initiate the forgot password process by sending an OTP to the user's email.
   *     consumes:
   *       - application/x-www-form-urlencoded
   *     produces:
   *       - application/json
   *       - application/x-www-form-urlencoded
   *     parameters:
   *       - name: "email"
   *         in: "formData"
   *         description: "Enter user email"
   *         required: true
   *         type: "string"
   *     responses:
   *       200:
   *         description: Your forgot password OTP has been successfully sent.
   *         schema:
   *           type: object
   *           properties:
   *             userId:
   *               type: string
   *             password:
   *               type: string
   *             createdBy:
   *               type: string
   *             createdOn:
   *               type: string
   *               format: date-time
   *             createdByIp:
   *               type: string
   *             status:
   *               type: string
   *           required:
   *             - userId
   *             - password
   *             - createdBy
   *       400:
   *         description: User not found in the database or invalid request.
   */

  router.post(`/forgotPassword`, UserController.forgotPassword);

  /**
   * @swagger
   * /user/reset-password-link-check:
   *   get:
   *     tags:
   *       - User Auth
   *     summary: Confirm user reset password link
   *     description: Verify the OTP sent to the user's email to proceed with resetting the password.
   *     consumes:
   *       - application/x-www-form-urlencoded
   *     produces:
   *       - application/json
   *       - application/x-www-form-urlencoded
   *     parameters:
   *       - name: "otp"
   *         in: "query"
   *         description: "Enter OTP"
   *         type: "string"
   *         required: true
   *       - name: "userId"
   *         in: "query"
   *         description: "Enter user ID"
   *         type: "string"
   *         required: true
   *     responses:
   *       200:
   *         description: Successfully checked user reset password link.
   *       400:
   *         description: User not found in the database or invalid request.
   */

  //#endregion User Auth
  router.get(`/reset-password-link-check`, UserController.resetPassword);

  //#region User change password
  /**
   * @swagger
   * /user/changePassword:
   *   post:
   *     tags:
   *       - User Auth
   *     summary: Change consumer password
   *     description: Change consumer password
   *     consumes:
   *       - application/x-www-form-urlencoded
   *     produces:
   *       - application/json
   *       - application/x-www-form-urlencoded
   *     parameters:
   *       - name: "userId"
   *         in: "formData"
   *         description: "Enter userId"
   *         required: true
   *         type: "string"
   *       - name: "newPassword"
   *         in: "formData"
   *         description: "Consumer new & confirm password"
   *         required: true
   *         type: "string"
   *       - name: "oldPassword"
   *         in: "formData"
   *         description: "Consumer old Password"
   *         required: true
   *         type: "string"
   *     responses:
   *       200:
   *         description: Change password successful.
   *       400:
   *         description: Bad request. Please check your input data.
   *         schema:
   *           type: object
   *           properties:
   *             isSuccess:
   *               type: boolean
   *             message:
   *               type: string
   *             data:
   *               type: object
   *       404:
   *         description: User not found in the database.
   *         schema:
   *           type: object
   *           properties:
   *             isSuccess:
   *               type: boolean
   *             message:
   *               type: string
   *             data:
   *               type: object
   *       401:
   *         description: Unauthorized. Old password is incorrect.
   *         schema:
   *           type: object
   *           properties:
   *             isSuccess:
   *               type: boolean
   *             message:
   *               type: string
   *             data:
   *               type: object
   *       500:
   *         description: Internal server error. Something went wrong.
   *         schema:
   *           type: object
   *           properties:
   *             isSuccess:
   *               type: boolean
   *             message:
   *               type: string
   *             data:
   *               type: object
   *     security:
   *       - bearerAuth: []
   */
  //#endregion
  router.post(`/changePassword`, UserController.changePassword);

  /**
   * @swagger
   * /user/create-password:
   *   post:
   *     tags:
   *       - User Auth
   *     summary: Create Password
   *     description: Create a password for a user during initial setup
   *     consumes:
   *       - application/x-www-form-urlencoded
   *     produces:
   *       - application/json
   *       - application/x-www-form-urlencoded
   *     parameters:
   *       - name: "userId"
   *         in: "formData"
   *         description: "Enter userId"
   *         type: "string"
   *         required: true
   *       - name: "password"
   *         in: "formData"
   *         description: "User password"
   *         type: "string"
   *         required: true
   *     responses:
   *       200:
   *         description: Password created successfully.
   *       400:
   *         description: Bad request. Please check your input data.
   *       404:
   *         description: User not found in the database.
   *       500:
   *         description: Internal server error. Something went wrong.
   */

  router.post(`/create-password`, UserController.createPassword);

  //#region User Check Email
  /**
   * @swagger
   * /user/check-email:
   *   post:
   *     tags:
   *       - User Auth
   *     summary: Check if Email is available
   *     description: Check if the provided email is available or already taken
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: apiRoot
   *         in: path
   *         description: The root path for the API.
   *         required: true
   *         type: string
   *       - name: email
   *         in: formData
   *         description: User's email address to check availability
   *         required: true
   *         type: string
   *         format: email
   *     responses:
   *       200:
   *         description: Email availability check successful
   *         schema:
   *           type: object
   *           properties:
   *             isSuccess:
   *               type: boolean
   *             message:
   *               type: string
   *       400:
   *         description: Invalid or missing email parameter
   *         schema:
   *           type: object
   *           properties:
   *             isSuccess:
   *               type: boolean
   *             message:
   *               type: string
   *       404:
   *         description: Email is already taken
   *         schema:
   *           type: object
   *           properties:
   *             isSuccess:
   *               type: boolean
   *             message:
   *               type: string
   */

  router.post(`/check-email`, UserController.isEmail);

  //#region logout
  /**
   * @swagger
   * /logout:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - User Auth
   *     summary: logout Account
   *     description: logout Account
   *     consumes:
   *       - application/x-www-form-urlencoded
   *     produces:
   *       - application/json
   *       - application/x-www-form-urlencoded2wCEAAkGBxMSEhITEx ..."
   *     responses:
   *       200:
   *         description: succesfully activated user Account.
   *         schema:
   *           definitions:
   *               otpSchema:
   *                 type: Object
   *                 properties:
   *                   userId :
   *                     type : objectId
   *                   otp :
   *                     type : String
   *                   usedFor :
   *                     type : String
   *                   status :
   *                     type : Number
   *       400:
   *         description: Not found in db
   */
  //#endregion

  router.get(`/logout`, UserController.logout);

  /**
   * @swagger
   * /user/user-info:
   *   get:
   *     tags:
   *       - User Auth
   *     summary: Get User Information
   *     description: Get the information of the authenticated user.
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: Authorization
   *         in: header
   *         description: Bearer token for user authentication.
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: User information retrieved successfully.
   *         schema:
   *           type: object
   *           properties:
   *             isSuccess:
   *               type: boolean
   *             data:
   *               $ref: "#/definitions/userInfo"
   *       401:
   *         description: Unauthorized. The user must be authenticated to access their information.
   *         schema:
   *           type: object
   *           properties:
   *             isSuccess:
   *               type: boolean
   *             message:
   *               type: string
   */

  router.get(`/user-info`, isUser, UserController.Getuser);

  return router;
};
