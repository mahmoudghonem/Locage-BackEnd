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
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  },
  versionKey: false,
  collection: 'carts',
});

CartSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
const cart = mongoose.model('Cart', CartSchema);

module.exports = cart;
