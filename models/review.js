const mongoose = require("mongoose");
const { Schema } = mongoose;

const ReviewSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: "products",
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
    },
    comment: [String],
    rate: {
        type: Number,
        min: 1,
        max: 5
    },
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
ReviewSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
const review = mongoose.model("Reveiw", ReviewSchema);

module.exports = review;
