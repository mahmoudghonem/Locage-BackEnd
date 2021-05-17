const mongoose = require("mongoose");
const { Schema } = mongoose;

const ReviewSchema = new Schema({
    productId: {
      type: Schema.Types.ObjectId,
      ref: "products",
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref:'users',
        },
    comment:[String],
    rate: {
        type: Number,
        min:1,
        max:5
    },
},{
        versionKey: false,
        collection: "reviews",
    }
);

const review = mongoose.Model("Reveiw", ReviewSchema);

module.exports = review;
