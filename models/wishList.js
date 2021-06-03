const mongoose = require("mongoose");
const { Schema } = mongoose;

const WishListSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    list: [
        {
            type: Schema.Types.ObjectId,
            ref: 'products',
        }
    ],
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    },
    versionKey: false,
    collection: 'wishlists'
});

WishListSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
const wishlists = mongoose.model('WishLists', WishListSchema);
module.exports = wishlists;