/* eslint-disable no-undef */
const mongoose = require("mongoose");
const { Schema } = mongoose;

const ShipmentSchema = new Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    address: {
        type: String
    },
    city: {
        type: String
    },
    country: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    primary: {
        type: Boolean,
        default: false
    },
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
    collection: 'shipments'
});

ShipmentSchema.virtual('fullAddress').get(function () {
    return `${this.address}, ${this.city}, ${this.country}`;
});
const shipment = mongoose.model('Shipment', ShipmentSchema);
module.exports = shipment;