const mongoose = require("mongoose");
const { Schema } = mongoose;

const DiscountSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "products",
  },
  discountPercent: {
    type: Number,
    required: true,
  },
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
