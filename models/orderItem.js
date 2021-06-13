const mongoose = require("mongoose");
const { Schema } = mongoose;
const mongoosePaginate = require('mongoose-paginate-v2');

const OrderItemSchema = new Schema({
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
    orderId: {
        type: Schema.Types.ObjectId,
        ref: "orders",
    },
    vendorId: {
        type: Schema.Types.ObjectId,
        ref: "stores",
      }
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    },
    versionKey: false,
    collection: "orderItems",
});
// OrderItemSchema.virtual('id').get(function () {
//     return this._id.toHexString();
// });

OrderItemSchema.plugin(mongoosePaginate);

const orderItem = mongoose.model("OrderItem", OrderItemSchema);


module.exports = orderItem;
