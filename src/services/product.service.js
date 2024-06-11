"use strict";

const { BadRequestError } = require("../core/error.response");
const { product, clothe, electronic } = require("../models/product.model");
const {
  queryProducts,
  publishProductByShop,
  unPublishProductByShop,
  searchProductByUser,
  queryProducts1,
  updateProductById,
} = require("../models/repositories/product.repo");
const {
  ToColumnDataUnSelect,
  RemoveUndefined,
  FlattenObject,
} = require("../utils");

class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  async createProduct(product_id) {
    return await product.create({ ...this, _id: product_id });
  }

  async updateProduct(product_id, body) {
    return await updateProductById({ product_id, body, model: product });
  }
}

class ProductFactory {
  static productRegistry = {};

  static registerProduct(type, productClass) {
    ProductFactory.productRegistry[type] = productClass;
  }

  static async createProduct(type, payload) {
    console.log(ProductFactory.productRegistry);
    const producClass = ProductFactory.productRegistry[type];
    if (!producClass) throw new BadRequestError(`Invalid product type ${type}`);

    return new producClass(payload).createProduct();
  }

  //PUT//
  static async publishProductByShop({ product_shop, product_id }) {
    return publishProductByShop({ product_shop, product_id });
  }
  static async unPublishProductByShop({ product_shop, product_id }) {
    return unPublishProductByShop({ product_shop, product_id });
  }

  static async findAllPublishedForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true };
    return await queryProducts({ query, limit, skip });
  }

  static async findAllDraftForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await queryProducts({ query, limit, skip });
  }

  static async searchProduct({ keySearch }) {
    return await searchProductByUser({ keySearch });
  }

  static async findAllProducts({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublished: true },
    select = ["product_name", "product_thumb", "product_price"],
  }) {
    return await queryProducts1({ limit, sort, page, filter, select });
  }

  static async findProduct({
    product_id,
    unSelect = ["__v", "product_attributes"],
  }) {
    return await product
      .findById(product_id)
      .select(ToColumnDataUnSelect(unSelect))
      .lean();
  }

  static async updateProduct(type, product_id, payload) {
    const producClass = ProductFactory.productRegistry[type];
    if (!producClass) throw new BadRequestError(`Invalid product type ${type}`);

    return new producClass(payload).updateProduct(product_id);
  }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothe.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) throw new BadRequestError("create new clothing error");

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequestError("create new product error");

    return newProduct;
  }

  async updateProduct(product_id) {
    //1. remove attr has null or undefined
    const body = RemoveUndefined(this);
    console.log(`body:::::::::::::::::`, body);
    //2. check xem update o dau? product hay attribute?
    if (body.product_attributes) {
      //update child
      const attributesBody = FlattenObject(body.product_attributes);
      console.log(`attributesBody:::::::::::::::::`, attributesBody);
      await updateProductById({
        product_id,
        body: attributesBody,
        model: clothe,
      });
    }

    const updateProduct = await super.updateProduct(product_id, body= FlattenObject(body));
    return updateProduct;
  }
}

class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic) throw new BadRequestError("create new clothing error");

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequestError("create new product error");

    return newProduct;
  }
}

// ProductFactory.registerProduct("Clothing", Clothing);
ProductFactory.registerProduct("Clothing", Clothing);
ProductFactory.registerProduct("Electronics", Electronic);

module.exports = {
  Product,
  ProductFactory,
};
