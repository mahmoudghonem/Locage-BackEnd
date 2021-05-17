const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderSchema = new Schema({
    totalprice: {
        type: Number,
        default: 0,
        required: true
    },
    statusCode: {
        type: Number,
        required: true
    },
    comment: {
        type: String
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
    }
}, {
    versionKey: false,
    collection: "orders",
});

const order = mongoose.Model("Order", OrderSchema);

module.exports = order;