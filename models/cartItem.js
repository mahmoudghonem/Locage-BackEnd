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
    versionKey: false,
    collection: "cartItems",
});

const cartItem = mongoose.Model("CartItem", CartItemSchema);

module.exports = cartItem;
