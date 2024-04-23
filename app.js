require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const passport = require("passport");
const expressSession = require("express-session");
const MongoStore = require("connect-mongo");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Body parser middleware setup
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.json({ limit: "100mb", extended: true }));

// Session middleware setup
const maxAgeLimit = 4 * 60 * 60 * 1000;
app.use(
  expressSession({
    cookie: {
      maxAge: maxAgeLimit,
    },
    secret: process.env.KEY, // Ensure this is set in your .env file
    store: MongoStore.create({ mongoUrl: process.env.DB }),
    resave: true,
    saveUninitialized: true,
  })
);

// Passport initialization and configuration
app.use(passport.initialize());
app.use(passport.session());
const initPassport = require("./passport/init");
initPassport(passport);

// Logger, static files, and other middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// CORS configuration
app.use(cors({ origin: true, credentials: true }));

// Cross-origin middleware
var allowCrossDomain = function (req, res, next) {
  var allowedOrigins = [`${process.env.FRONTEND}`];
  var origin = req.headers.origin;
  if (allowedOrigins.indexOf(origin) > -1) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header(
    "Access-Control-Allow-Methods",
    "GET, PUT, POST, DELETE, PATCH, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, multipart/form-data"
  );
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Cache-Control", "no-store, no-cache, must-revalidate, private");
  return next();
};
app.use(allowCrossDomain);

// Swagger setup
const swaggerSpec = require("./swaggerConfig");
const swaggerUi = require("swagger-ui-express");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes setup
const indexRouter = require("./routes/index")(passport);
const usersRouter = require("./routes/users")(passport);
const portfoliosRouter = require("./routes/portfolio")(passport);

app.use("/", indexRouter);
app.use("/user", usersRouter);
app.use("/portfolio", portfoliosRouter);

module.exports = app;
