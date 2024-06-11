"use strict";
const { ToColumnDataSelect } = require("../../utils");
const { product, electronic, clothe } = require("../product.model");
const { BadRequestError } = require("../../core/error.response");

const publishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({ product_shop, _id: product_id });
  if (!foundShop) throw new BadRequestError("Product not found");

  foundShop.isDraft = false;
  foundShop.isPublished = true;

  const { modifiedCount } = await foundShop.updateOne(foundShop);
  console.log(modifiedCount);
  return modifiedCount;
};

const unPublishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({ product_shop, _id: product_id });
  if (!foundShop) throw new BadRequestError("Product not found");

  foundShop.isDraft = true;
  foundShop.isPublished = false;

  const { modifiedCount } = await foundShop.updateOne(foundShop);
  console.log(modifiedCount);
  return modifiedCount;
};

const searchProductByUser = async ({ keySearch }) => {
  const regexSeach = new RegExp(keySearch);
  const results = await product
    .find(
      { $text: { $search: regexSeach } },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .lean();
  return results;
};

const queryProducts = async ({ query, limit, skip, order = {updateAt: -1 }}) => {
  return await product
    .find(query)
    .populate("product_shop", "name email _id")
    .sort(order)
    .limit(limit)
    .skip(skip)
    .lean()
    .exec();
};

const queryProducts1 = async ({ limit, sort, page, filter, select}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort ==='ctime' ?{_id: -1} : {_id: 1}; 
  const products = await product
  .find(filter)
  .sort(sortBy)
  .skip(skip)
  .limit(limit)
  .select(ToColumnDataSelect(select))
  .lean();

  return products;
};

const updateProductById = async({
  product_id,
  body,
  model,
  isNew=true
})=>{
  return await model.findByIdAndUpdate(product_id, body, {new : isNew})
}

module.exports = {
  publishProductByShop,
  queryProducts,
  unPublishProductByShop,
  searchProductByUser,
  queryProducts1,
  updateProductById
};
