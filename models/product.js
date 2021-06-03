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
  },
  description: {
    type: String,
    required: true,
    maxlength: 500,
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
  color: {
    type: [String],
  },
  brand: {
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
  photosPublicId: {
    required: true,
    type: [String],
  },
  rating: {
    type: Number,
  },
  unitsInOrder: {
    type: Number,
  },
  discount: {
    type: Number
  },
  discountDate: {
    type: String
  },
  productSpecifications: {
    required: true,
    type: String,
  }
},{
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.photosPublicId;
        return ret;
    },
    },
    toObject: {
      virtuals: true
    },
    versionKey: false,
    collection: "products",
});

ProductSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

ProductSchema.plugin(mongoosePaginate);

// Model creation
const products = mongoose.model("Product", ProductSchema);

module.exports = products;
