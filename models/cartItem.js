const mongoose = require("mongoose");
const { Schema } = mongoose;

const CartItemSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "products",
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  cartId: {
    type: Schema.Types.ObjectId,
    ref: "carts",
  },
}, {
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  },
  versionKey: false,
  collection: "cartItems",
});

CartItemSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

const cartItem = mongoose.model("CartItem", CartItemSchema);

module.exports = cartItem;
