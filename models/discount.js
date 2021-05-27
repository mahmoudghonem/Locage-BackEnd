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
    versionKey: false,
    collection: 'discounts'
});

const discount = mongoose.model('Discount', DiscountSchema);

module.exports = discount;
