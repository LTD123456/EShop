"use strict";

const apiKeyModel = require("../models/apiKey.model");

const findById = async (key) => {
  const newKey = await apiKeyModel.create({key:crypto.randomUUID(), status:true, permissions:["0000"]});
  console.log("key::::::::::::", key);
  const objKey = await apiKeyModel.findOne({ key: key, status: true }).lean();
  return objKey;
};

module.exports = {
  findById,
};
