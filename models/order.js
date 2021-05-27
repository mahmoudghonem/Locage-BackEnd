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