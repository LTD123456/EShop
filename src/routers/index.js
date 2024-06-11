'use strict'

const express = require('express');
const router = express.Router();
const {apiKey, permission} = require('../auth/checkAuth');
const accessController = require('../controllers/access.controller');
const asyncHandler = require('../helpers/asyncHandler');

//check apiKey
router.use(apiKey); //check apiKey
// not need authentication

//check permission
router.use(permission('0000'));
router.use('/v1/api', require('./product'));
router.use('/v1/api', require('./access'));



module.exports = router; // Export the router