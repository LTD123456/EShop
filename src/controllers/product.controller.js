'use strict'

const { OK, CREATED, SuccessResponse } = require("../core/success.response");
const { product } = require("../models/product.model");
const { ProductFactory } = require("../services/product.service");

class ProductController {
    createProduct = async(req, res, next) => {
        new CREATED({
            message: "Create Product successfully!!!!",
            metadata: await ProductFactory.createProduct(req.body.product_type,{
                ...req.body,
                product_shop: req.user.userId,
            }),
          }).send(res);
    }


    /**
     * 
     * @desc get all draft product for shop
     * @param {String} product_shop 
     * @param {number} limit - default 50 
     * @param {number} skip - default 0 
     */
    getAllDraftForShop = async(req, res, next) => {
        new SuccessResponse({
            message: "Get All Draft Product Successfully!!!!",
            metadata: await ProductFactory.findAllDraftForShop({
                product_shop: req.user.userId,
                limit: req.query.limit ?? 50,
                skip: req.query.skip ?? 0,
            }),
        }).send(res);
    }

    /**
     * 
     * @desc get all published product for shop
     * @param {String} product_shop 
     * @param {number} limit - default 50 
     * @param {number} skip - default 0 
     */
    getAllPublishedForShop = async(req, res, next) => {
        new SuccessResponse({
            message: "Get All Published Product Successfully!!!!",
            metadata: await ProductFactory.findAllPublishedForShop({
                product_shop: req.user.userId,
                limit: req.query.limit ?? 50,
                skip: req.query.skip ?? 0,
            }),
        }).send(res);
    }

    /**
     * 
     * @desc publish a product by shop
     * @param {String} product_shop 
     * @param {number} limit - default 50 
     * @param {number} skip - default 0 
     */
    publishProductByShop = async(req, res, next) => {
        new SuccessResponse({
            message: "Publish a product Successfully!!!!",
            metadata: await ProductFactory.publishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id,
            }),
        }).send(res);
    }

    /**
     * 
     * @desc un-publish a product by shop
     * @param {String} product_shop 
     * @param {number} limit - default 50 
     * @param {number} skip - default 0 
     */
    unPublishProductByShop = async(req, res, next) => {
        new SuccessResponse({
            message: "Un-Publish a product Successfully!!!!",
            metadata: await ProductFactory.unPublishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id,
            }),
        }).send(res);
    }

    /**
     * 
     * @desc Search product
     * @param {String} product_shop 
     * @param {number} limit - default 50 
     * @param {number} skip - default 0 
     */
    getListSearchProduct = async(req, res, next) => {
        new SuccessResponse({
            message: "Search product Successfully!!!!",
            metadata: await ProductFactory.searchProduct(req.params),
        }).send(res);
    }
}

module.exports = new ProductController(); 