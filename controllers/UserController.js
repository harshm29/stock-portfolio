require("dotenv").config();
const mongoose = require("mongoose");
const Validator = require("validatorjs");
const bcrypt = require("bcryptjs");
const moment = require("moment-timezone");
const security = process.env.KEY;
const Cryptr = require("cryptr");
const cryptr = new Cryptr(security);
const jwt = require("jsonwebtoken");
const appRoot = require("app-root-path").path;
const fileUploadAbsolutePath = `${appRoot}/`;

/* utility */
const fileUpload = require("../utility/File");
const commonMethod = require("../utility/common");

/*  models */
const User = require("../models/User");

exports.Registration = async (req, res) => {
  try {
    const userInfo = req.body;

    let rules = {
      name: "required",
      email: "required|email",
      mobile: "required|min:10|max:12",
      dob: "required",
      gender: "required",
      password: "required",
      voter_id: "required",
    };

    let validation = new Validator(userInfo, rules);

    if (validation.fails()) {
      res.status(400).send({
        success: false,
        message: validation.errors.errors,
      });
    } else {
      // Check if email is already registered
      let isMatch = await User.findOne({ email: userInfo.email });

      if (isMatch) {
        res.status(400).send({
          success: false,
          message: "Your Email is already registered.",
        });
      } else {
        // Generate hash password
        let hashPassword = await bcrypt.hash(userInfo.password, 10);

        // Convert dob to IST
        let dobIST = moment.tz(userInfo.dob, "DD-MM-YYYY", "Asia/Kolkata");

        const data = {
          name: userInfo.name,
          email: userInfo.email,
          mobile: userInfo.mobile,
          dob: dobIST.toDate(),
          gender: userInfo.gender,
          password: hashPassword,
          voter_id: userInfo.voter_id,
        };

        const userInsertResponse = await User.create(data);

        const { password, ...userDetails } = userInsertResponse.toObject();

        if (userInsertResponse) {
          res.status(200).send({
            success: true,
            message: "User registered successfully.",
            data: userDetails,
          });
        } else {
          res.status(500).send({
            success: false,
            message: "Failed to register user.",
            data: "",
          });
        }
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      success: false,
      message: "Internal server error.",
      data: "",
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const userInfo = req.body;
    const rules = {
      email: "required|email",
      type: "required",
      password: "required",
    };
    const validation = new Validator(userInfo, rules);

    if (validation.fails()) {
      return res.status(400).json({
        success: false,
        message: validation.errors.all(),
      });
    }

    const isMatch = await User.findOne({
      email: userInfo.email,
      type: userInfo.type,
    });

    if (!isMatch) {
      return res.status(200).json({
        success: false,
        message: "User not found.",
      });
    }

    const isPasswordMatch = await bcrypt.compare(
      userInfo.password,
      isMatch.password
    );

    if (!isPasswordMatch) {
      return res.status(200).json({
        success: false,
        message: "Incorrect password.",
      });
    }

    const payload = {
      id: isMatch._id,
      email: isMatch.email,
    };

    const generateToken = jwt.sign(payload, security, {
      expiresIn: "30d",
    });

    if (!generateToken) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate token.",
      });
    }

    let status = "offline";
    if (isMatch.type === "doctor") {
      status = "offline";
    } else {
      status = "online";
    }

    await User.findByIdAndUpdate(
      { _id: isMatch._id },
      {
        $set: {
          status: status,
        },
      },
      { new: true }
    );
    // Remove the password field from the isMatch object
    const { password, ...userDetails } = isMatch.toObject();
    res.status(200).json({
      success: true,
      token: "Bearer " + generateToken,
      userDetails: userDetails,
      message: "You have logged in successfully.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "An error occurred.",
    });
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const userInfo = req.body;
    const rules = {
      email: "required|email",
    };
    const validation = new Validator(userInfo, rules);

    if (validation.fails()) {
      return res.status(400).json({
        success: false,
        message: validation.errors.all(),
      });
    }

    const email = req.body.email;
    const userDetail = await User.findOne({ email: email });
    if (!userDetail) {
      return res.status(404).json({
        success: false,
        message: "No user found or account not activated",
      });
    }

    const userId = cryptr.encrypt(userDetail._id);
    const otp = await commonMethod.genOTP();
    var html = await fileUpload.getFileContent(
      fileUploadAbsolutePath + "/public/email/forgotPassword.html"
    );
    html = html.replace(
      /{linkHref}/g,
      `${
        process.env.HOST
      }user/reset-password-link-check?otp=${otp}${"&userId="}${userId}`
    );

    const mailSent = await commonMethod.mail(
      userDetail.email,
      "OPS set password Link",
      html
    );
    const seveOtp = await OTP.create({
      user_id: userDetail._id,
      otp: otp,
      usedFor: "forgot password",
      status: 1,
    });
    // Activity Log
    res.status(200).json({
      success: true,
      message:
        "Link sent successfully to email. Please click on the link to reset your password.",
      userId: userDetail._id,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const otp = req.query.otp;
    const userIdenc = req.query.userId;
    if (!otp || !userIdenc) {
      return res.status(400).json({
        success: false,
        message: "Please provide otp and user id",
        data: "",
      });
    }

    const userId = cryptr.decrypt(userIdenc);
    const otpVerify = await OTP.findOne({
      user_id: userId,
      otp: otp,
    });
    if (!otpVerify) {
      return res.status(404).json({
        success: false,
        message: "User not verified",
        data: "",
      });
    }

    if (otpVerify.status === 2) {
      const userInfo = await User.findOne({ _id: userId });
      if (!userInfo) {
        return res.status(404).json({
          success: false,
          message: "User record not found",
          data: "",
        });
      }

      return res.redirect(
        301,
        process.env.FRONTENDURL + "confirm-password/" + userId
      );
    }

    const updateOtpStatus = await OTP.updateOne(
      { otp: otp },
      { $set: { status: 2 } }
    );

    return res.redirect(
      301,
      process.env.FRONTENDURL + "confirm-password/" + userIdenc
    );
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;

    if (!userId || !newPassword || !oldPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide user id and new & old password",
      });
    }

    const userDetail = await User.findOne({ _id: userId });

    if (!userDetail) {
      return res.status(404).json({
        success: false,
        message: "No user found",
        data: {},
      });
    }

    const isOldPassword = await bcrypt.compare(
      oldPassword,
      userDetail.password
    );

    if (!isOldPassword) {
      return res.status(401).json({
        success: false,
        message: "Old password is wrong",
      });
    }

    const hashPassword = await bcrypt.hashSync(newPassword, 10);
    const updateResponse = await User.updateOne(
      { _id: userId },
      { $set: { password: hashPassword } }
    );

    if (updateResponse) {
      return res.status(200).json({
        success: true,
        message: "Password updated successfully",
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.createPassword = async (req, res, next) => {
  try {
    const userIdenc = req.body.userId;
    const newPassword = req.body.password;

    if (!userIdenc || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide user id and password",
      });
    }

    const userDetail = await User.findOne({
      _id: new mongoose.Types.ObjectId(userIdenc),
    });

    if (!userDetail) {
      return res.status(404).json({
        success: false,
        message: "No user found",
        data: {},
      });
    }

    const hashPassword = await bcrypt.hashSync(newPassword, 10);
    const updateResponse = await User.updateOne(
      { _id: new mongoose.Types.ObjectId(userIdenc) },
      { $set: { password: hashPassword } }
    );

    if (updateResponse) {
      return res.status(200).json({
        success: true,
        message: "Password updated successfully",
        userType: userDetail.type,
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.isEmail = async (req, res, next) => {
  try {
    //console.log("email");
    const userInfo = req.body;
    const email = req.body.email;
    let rules = {
      email: "required|email",
    };
    let validation = new Validator(userInfo, rules);

    const isValid = validation.passes();
    if (!isValid) {
      res.send({
        success: false,
        message: validation.errors.errors,
      });
    } else {
      let isMatch = await User.findOne({
        email: email,
      });

      if (isMatch) {
        res.send({
          success: true,
          message: "Your Email address already exists!!",
        });
      } else {
        res.send({
          success: false,
          message: "Your Email address not exists.",
        });
      }
    }
  } catch (err) {
    res.send({
      success: false,
      message: err,
    });
  }
};

exports.logout = async (req, res, next) => {
  try {
    let token = req.headers["authorization"];
    var decoded = await commonMethod.userTokenValidate(token);
    if ("success" in decoded) {
      res.send(decoded);
      return;
    }
    const user_id = decoded.id;

    const userOTPupdate = await User.updateOne(
      { _id: new mongoose.Types.ObjectId(user_id) },
      {
        $set: {
          status: "offline",
          assign_doctor: false,
          otp_time: "",
          login_attempts: 0,
          token: null,
        },
      }
    );
    if (userOTPupdate) {
      res.send({
        success: true,
        message: "You have logout Successfully",
      });
    } else {
      res.send({
        success: false,
        message: "You have not logout Successfully",
      });
    }
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
    });
  }
};

exports.Getuser = async (req, res, next) => {
  try {
    let token = req.headers["authorization"];
    var decoded = await commonMethod.userTokenValidate(token);
    if ("success" in decoded) {
      res.send(decoded);
      return;
    }
    const user_id = decoded.id;

    let isMatch = await User.findOne({
      _id: new mongoose.Types.ObjectId(user_id),
    });

    if (isMatch) {
      const { password, ...userDetails } = isMatch.toObject();
      return res.send({
        success: true,
        message: "User info found Successfully!!",
        data: userDetails,
      });
    } else {
      return res.send({
        success: false,
        message: "User info not found!!",
      });
    }
  } catch (err) {
    return res.send({
      success: false,
      message: err,
    });
  }
};
