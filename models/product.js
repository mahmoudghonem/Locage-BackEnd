const mongoose = require("mongoose");
const { Schema } = mongoose;
const mongoosePaginate = require('mongoose-paginate-v2');

// Product schema definition
const ProductSchema = new Schema({
  title: {
    type: String,
    required: true,
    maxlength: 150,
    minlength: 3,
    unique: true,
  },
  description: {
    type: String,
    required: true,
    maxlength: 500,
    minlength: 50,
  },
  price: {
    required: true,
    type: Number,
  },
  subcategoryId: {
    type: Schema.Types.ObjectId,
    ref: "subcategories",
  },
  vendorId: {
    type: Schema.Types.ObjectId,
    ref: "stores",
  },
  sku: {
    type: String,
  },
  quantity: {
    required: true,
    type: Number,
  },
  size: {
    type: String,
  },
  Weight: {
    type: Number,
  },
  photos: {
    required: true,
    type: [String],
  },
  rating: {
    type: Number,
  },
  unitsInOrder: {
    type: Number,
  },
},{
    versionKey: false,
    collection: "products",
});

ProductSchema.plugin(mongoosePaginate);

// Model creation
const products = mongoose.model("Product", ProductSchema);

module.exports = products;
