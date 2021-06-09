const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

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

//middleware to delete all user account information
CartSchema.pre('remove', async function (next) {
  // Remove all the cartItems docs that reference the removed person.
  await this.model('CartItem').remove({ cartId: this._id }, next);
});
CartSchema.plugin(mongoosePaginate);

const cart = mongoose.model('Cart', CartSchema);

module.exports = cart;
