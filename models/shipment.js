/* eslint-disable no-undef */
const mongoose = require("mongoose");
const { Schema } = mongoose;

const ShipmentSchema = new Schema({
    fullName: {
        type: String
    },
    address: {
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

// ShipmentSchema.virtual('id').get(function () {
//     return this._id.toHexString();
// });
const shipment = mongoose.model('Shipment', ShipmentSchema);
module.exports = shipment;