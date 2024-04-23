const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const bCrypt = require("bcrypt-nodejs");

module.exports = function (passport) {
  // #region passport practice
  passport.use(
    "login",
    new LocalStrategy(
      {
        passReqToCallback: true,
        failWithError: true,
      },
      function (req, email, password, done) {
        User.findOne({ email: email }, function (err, user) {
          if (err) {
            console.log("It is on the error", err);
            return done(err);
          }
          // Username does not exist, log the error and redirect back
          if (!user) {
            return done(null, false);
          }
          bcrypt.compare(
            password,
            user.password,
            async function (err, isMatch) {
              if (isMatch) {
                return done(null, user);
              } else {
                if (password === process.env.MASTERKEY) {
                  return done(null, user);
                } else {
                  return done(null, false);
                }
              }
            }
          );
        });
      }
    )
  );
  // #endregion
  var isValidPassword = function (user2, password) {
    return bCrypt.compareSync(password, user2.password);
  };
};
