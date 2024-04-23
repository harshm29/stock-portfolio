require("dotenv").config();
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");
const secretOrKey = process.env.KEY;
exports.mail = async (email, subject, data) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PWD,
      },
    });

    let mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: subject,
      html: data,
    };

    let info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);

    return {
      mailSent: true,
      message: "Email sent successfully.",
    };
  } catch (error) {
    console.log(error);
    return {
      mailSent: false,
      message: "Failed to send email.",
    };
  }
};

exports.genOTP = () => {
  var digits = 7;
  var numfactor = Math.pow(10, parseInt(digits - 1));
  var randomNum = Math.floor(Math.random() * numfactor) + 1;
  return randomNum;
};

exports.getYearMonthDirectoryNumber = async () => {
  let date = new Date(),
    month = "" + (date.getMonth() + 1),
    year = date.getFullYear().toString();

  if (month.length < 2) month = "0" + month;
  return [year, month];
};

exports.checkPassword = (str) => {
  var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  return re.test(str);
};

exports.adminTokenValidate = async (token) => {
  if (token) {
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length);
    }

    const decoded = await jwt.verify(token, secretOrKey);

    if (decoded != null) {
      const userDetail = await User.findOne({ _id: decoded.id });

      let userType = userDetail.type;

      if (userType != null) {
        if (userType === "admin") {
          return decoded;
        } else {
          return {
            isSuccess: false,
            message: "You are not authorised",
            data: {},
          };
        }
      }
    } else {
      return {
        isSuccess: false,
        message: "Token is not valid",
      };
    }
  } else {
    return {
      isSuccess: false,
      message: "Token is not supplied",
    };
  }
};
exports.userTokenValidate = async (token) => {
  if (token) {
    //====Login Authorization
    if (token.startsWith("Bearer ")) {
      // Remove Bearer from token string
      token = token.slice(7, token.length);
    }

    try {
      const decoded = await jwt.verify(token, secretOrKey);
      if (decoded != null) {
        //#region Check Admin
        const userDetail = await User.findOne({ _id: decoded.id });

        if (userDetail.name) {
          decoded.name = userDetail.name;
        }

        if (userDetail.mobile) {
          decoded.mobile = userDetail.mobile;
        }

        //#endregion
        if (userDetail.type != null) {
          return decoded;
        } else {
          return {
            isSuccess: false,
            message: "You are not authorised",
            data: {},
          };
        }
      } else {
        return {
          isSuccess: false,
          message: "Token is not valid",
        };
      }
    } catch (err) {
      return {
        isSuccess: false,
        message: err.message,
      };
    }
  } else {
    return {
      isSuccess: false,
      message: "Token is not supplied",
    };
  }
};
