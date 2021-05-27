const mongoose = require('mongoose');
const { Schema } = mongoose;

const CreditCardSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    cardNumber: {
        type: Number,
        required: true
    },
    cardExpM: {
        type: Number,
        required: true
    },
    cardExpY: {
        type: Number,
        required: true
    },
    cardSecNum: {
        type: Number,
        required: true
    },
    paymentId: {
        type: Schema.Types.ObjectId,
        ref: 'paymentmethods'
    },
}, {
    collection: 'creditcards'
});

const creditcard = mongoose.model('CreditCard', CreditCardSchema);
module.exports = creditcard;