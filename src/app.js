require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const app = express();

//init middleware
app.use(morgan("dev"));
//helmet is a middleware that helps you secure your Express apps by setting various HTTP headers.
app.use(helmet());
//compression is a middleware that will attempt to compress response bodies for all request that
//traverse through the middleware.
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//init db
require("./dbs/init.mongodb");
// const { checkOverload } = require('./helpers/check.connect');
// checkOverload();

//init routes
app.use("/", require("./routers"));

// handling error
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    stack:error.stack,
    message: error.message ?? "Internal Server Error",
  });
});

module.exports = app;
