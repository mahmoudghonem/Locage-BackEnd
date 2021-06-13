const mongoose = require("mongoose");
const { Schema } = mongoose;
const mongoosePaginate = require('mongoose-paginate-v2');

const DiscountSchema = new Schema({
  discountPercent: {
    type: Number,
    required: true,
  },
  code: {
    type: String,
    required: true
  },
  valid: {
    type: Boolean,
    default: true
  }
}, {
  toJSON: {
   // virtuals: true
  },
  toObject: {
   // virtuals: true
  },
  versionKey: false,
  collection: 'discounts'
});
// DiscountSchema.virtual('id').get(function () {
//   return this._id.toHexString();
// });
DiscountSchema.plugin(mongoosePaginate);

const discount = mongoose.model('Discount', DiscountSchema);

module.exports = discount;
