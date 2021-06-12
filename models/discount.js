const mongoose = require("mongoose");
const { Schema } = mongoose;

const DiscountSchema = new Schema({
  discountPercent: {
    type: Number,
    required: true,
  },
  code: {
    type: String,
    required: true
  },
  validity: {
    type: String,
    enum: ['valid', 'invalid'],
    default: 'valid'
  }
}, {
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  },
  versionKey: false,
  collection: 'discounts'
});
// DiscountSchema.virtual('id').get(function () {
//   return this._id.toHexString();
// });
const discount = mongoose.model('Discount', DiscountSchema);

module.exports = discount;
