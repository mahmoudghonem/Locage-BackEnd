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

//middleware to delete all user account information
PaymentMethodsSchema.pre('remove', async function (next) {
    // Remove all the paymentInformation docs that reference the removed person.
    await this.model('BankAccount').remove({ paymentId: this._id }, next);
    // Remove all the paymentInformation docs that reference the removed person.
    await this.model('CreditCard').remove({ paymentId: this._id }, next);
});

const paymentmethods = mongoose.model('PaymentMethod', PaymentMethodsSchema);
module.exports = paymentmethods;