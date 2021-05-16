const mongoose = require("mongoose");
const { Schema } = mongoose;

const CartSchema = new Schema({
    totalprice: {
      type: Number,
      default: 0,
      required: true
    }
}, {
    versionKey: false,
    collection: "carts",
});

const cart = mongoose.Model("Cart", CartSchema);

module.exports = cart;
