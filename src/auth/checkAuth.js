"use strict";

const { findById } = require("../services/apiKey.service");

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      return res.status(403).json({
        message: "Forbidden Error",
      });
    }

    console.log(key);
    const objKey = await findById(key);

    if (!objKey) {
      return res.status(403).json({
        message: "Forbidden Error 2",
      });
    }
    req.objKey = objKey;
    return next();
  } catch (error) {
    next(error);
  }
};

const permission = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      return res.status(403).json({
        message: "Permission Denied 3",
      });
    }

    console.log("permission:::", req.objKey.permissions);

    const validPermission = req.objKey.permissions.includes(permission);
    if (!validPermission) {
      return res.status(403).json({
        message: "Permission Denied 4",
      });
    }

    return next();
  };
};

const asyncHandler = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};

module.exports = { apiKey, permission, asyncHandler };
