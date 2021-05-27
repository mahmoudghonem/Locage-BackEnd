const mongoose = require("mongoose");
const { Schema } = mongoose;

const PaymentMethodsSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    },
    versionKey: false,
    collection: 'paymentmethods'
});

PaymentMethodsSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
const paymentmethods = mongoose.model('PaymentMethods', PaymentMethodsSchema);
module.exports = paymentmethods;