const mongoose = require("mongoose");
const { Schema } = mongoose;

const CatogrySchema = new Schema({
    name: {
        type: String,
        minlength: 3,
        maxlength: 50,
        required: true
    },
    photo: {
        type: String,
    },
    photoPublicId: {
        type: String,
    }
}, {
    toJSON: {
        //virtuals: true
        transform: (doc, ret) => {
            delete ret.photosPublicId;
            return ret;
        },
    },
    toObject: {
        //virtuals: true
    },
    versionKey: false,
    collection: "catogries",
});
// CatogrySchema.virtual('id').get(function () {
//     return this._id.toHexString();
// });
const catogry = mongoose.model("Catogry", CatogrySchema);

module.exports = catogry;