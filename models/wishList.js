const mongoose = require("mongoose");
const { Schema } = mongoose;

const WishListSchema = new Schema({
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
    collection: 'wishlists'
});

WishListSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

//middleware to delete all user account information
// WishListSchema.pre('remove', async function (next) {
// Remove all the wishListItems docs that reference the removed person.
//     await this.model('WishListItem').remove({ wishListId: this._id }, next);
// });

const wishlists = mongoose.model('WishList', WishListSchema);
module.exports = wishlists;