"use strict";
const { product, electronic, clothe } = require("../product.model");

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

const queryProducts = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate("product_shop", "name email _id")
    .sort({ updateAt: -1 })
    .limit(limit)
    .skip(skip)
    .lean()
    .exec();
};

module.exports = {
  publishProductByShop,
  queryProducts,
  unPublishProductByShop,
  searchProductByUser,
};
