/* eslint-disable no-undef */
const mongoose = require("mongoose");
const { Schema } = mongoose;

const ShipmentSchema = new Schema({
    toAddress: {
        type: String
    },
    fromAddress: {
        type: String
    },
    trackNumber: {
        type: String
    },
    sentAt: {
        type: Date,
        default: Date.now
    },
    orderId: {
        type: Schema.Types.ObjectId,
        ref: 'orders'
    },
}, {
    collection: 'shipments'
});

const shipment = mongoose.model('Shipment', ShipmentSchema);
module.exports = shipment;