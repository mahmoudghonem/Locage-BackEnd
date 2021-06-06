const mongoose = require("mongoose");
const { Schema } = mongoose;

const WishListItemSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'products'
    },
    wishListId: {
        type: Schema.Types.ObjectId,
        ref: 'wishlists'
    },
}, {
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
    versionKey: false,
    collection: 'wishlistitems'
});
WishListItemSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
const wishlistitems = mongoose.model('WishListItem', WishListItemSchema);
module.exports = wishlistitems;