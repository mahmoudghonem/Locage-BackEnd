const mongoose = require("mongoose");
const { Schema } = mongoose;

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
}, {
    versionKey: false,
    collection: "orderItems",
});

const orderItem = mongoose.model("OrderItem", OrderItemSchema);

module.exports = orderItem;
