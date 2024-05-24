"use strict";

const { size, max } = require("lodash");
const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "products";

const productSchema = new Schema(
  {
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: String,
    product_slug: String,
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: {
      type: String,
      required: true,
      enum: ["Electronics", "Clothing", "Books", "Furniture", "Others"],
    },
    product_shop: { type: Schema.Types.ObjectId, ref: "Shop", required: true },
    product_attributes: { type: Schema.Types.Mixed, required: true },
    //more
    product_ratingsAvg: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must can not be more than 5"],
      //lam tron
      set: (val) => Math.round(val * 10) / 10,
    },
    product_variations: { type: Array, default: [] },
    isDraft: { type: Boolean, default: true },
    isPublished: { type: Boolean, default: false },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

//create index for search
productSchema.index({product_name: 'text', product_description:'text'});
//Document middleware
productSchema.pre('save', function(next){
    this.product_slug = this.product_name.split(' ').join('-').toLowerCase();
    next();
})

const clothingSchema = new Schema(
  {
    brand: { type: String, required: true },
    size: { type: String, required: true },
    material: { type: String, required: true },
  },
  {
    collection: "clothes",
    timestamps: true,
  }
);

const electronicSchema = new Schema(
  {
    manufacturer: { type: String, required: true },
    model: { type: String, required: true },
    color: { type: String, required: true },
  },
  {
    collection: "electronics",
    timestamps: true,
  }
);

module.exports = {
  product: model(DOCUMENT_NAME, productSchema),
  clothe: model("clothing", clothingSchema),
  electronic: model("electronic", electronicSchema),
};
