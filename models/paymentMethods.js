const mongoose = require("mongoose");
const { Schema } = mongoose;

const PaymentMethodsSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
}, {
    collection: 'paymentmethods'
})

const paymentmethods = mongoose.model('PaymentMethods', PaymentMethodsSchema);
module.exports = paymentmethods;