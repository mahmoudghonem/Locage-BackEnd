const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderSchema = new Schema({
    totalprice: {
        type: Number,
        default: 0,
        required: true
    },
    status: {
        type: String,
        enum: ['processing', 'preparing', 'shipped', 'pickedup'],
        required: true
    },
    comment: {
        type: String
    },
    totalProducts: {
        type: Number
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
    },
    createAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    },
    versionKey: false,
    collection: "orders",
});
OrderSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
const order = mongoose.model("Order", OrderSchema);

module.exports = order;