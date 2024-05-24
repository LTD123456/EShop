"use strict";

const express = require("express");
const productController = require("../../controllers/product.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../auth/authUtils");
const router = express.Router();

router.get("/product/search/:keySearch", asyncHandler(productController.getListSearchProduct));

router.use(authenticationV2);
router.post("/product/create", asyncHandler(productController.createProduct));

router.get("/product/drafts/all", asyncHandler(productController.getAllDraftForShop));
router.get("/product/published/all", asyncHandler(productController.getAllPublishedForShop));

router.put("/product/publish/:id", asyncHandler(productController.publishProductByShop));
router.put("/product/unpublish/:id", asyncHandler(productController.unPublishProductByShop));

module.exports = router; // Export the router
