const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');
const { Schema } = mongoose;

const ReviewSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: "products",
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    comment: [String],
    rate: {
        type: Number,
        min: 1,
        max: 5
    },
    createAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    },
    versionKey: false,
    collection: "reviews",
}
);
// ReviewSchema.virtual('id').get(function () {
//     return this._id.toHexString();
// });
ReviewSchema.plugin(mongoosePaginate);
const review = mongoose.model("Reveiw", ReviewSchema);

module.exports = review;
