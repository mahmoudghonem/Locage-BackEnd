const mongoose = require("mongoose");
const { Schema } = mongoose;

const BankAccountSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    iban: {
        type: Number,
        required: true
    },
    swiftCode: {
        type: Number,
        required: true
    },
    paymentId: {
        type: Schema.Types.ObjectId,
        ref: 'paymentmethods'
    },
}, {
    collection: 'bankaccount'
});

const bankaccount = mongoose.model('BankAccount', BankAccountSchema);
module.exports = bankaccount;