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
      ref: "cart",
    },
}, {
    versionKey: false,
    collection: "cartItem",
});

const cartItem = mongoose.Model("CartItem", CartItemSchema);

module.exports = cartItem;