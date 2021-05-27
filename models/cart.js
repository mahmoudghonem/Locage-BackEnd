const mongoose = require("mongoose");
const { Schema } = mongoose;

const CartSchema = new Schema({
  totalprice: {
    type: Number,
    default: 0,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  }
}, {
  versionKey: false,
  collection: 'carts',
});

const cart = mongoose.model('Cart', CartSchema);

module.exports = cart;
