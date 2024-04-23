const swaggerJsdoc = require("swagger-jsdoc");
const swaggerOptions = {
  failOnErrors: true, // Whether or not to throw when parsing errors. Defaults to false.
  definition: {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Portfolio API",
      description:
        "A portfolio tracking API that allows adding/deleting/updating trades and can do basic return calculations etc.        .",
      contact: {
        name: "Portfolio",
      },
      servers: [`${process.env.HOST}`],
    },
    host: process.env.HOST,

    securityDefinitions: {
      bearerAuth: {
        type: "apiKey",
        name: "Authorization",
        schema: "bearer",
        in: "header",
      },
    },
  },
  apis: [
    "./routes*.js",
    "./routes/index.js",
    "./routes/users.js",
    "./routes/portfolio.js",
  ],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpec;
