const mongoose = require("mongoose");
const { Schema } = mongoose;
const Category = require('./catogry');

const SubcategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    maxlength: 50,
    unique: true,
  },
  photo: {
    type: String,
  },
  photoPublicId: {
      type: String,
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: Category,
  },
}, {
  toJSON: {
   // virtuals: true
   transform: (doc, ret) => {
    delete ret.photoPublicId;
    return ret;
  },
  },
  toObject: {
    //virtuals: true
  },
  versionKey: false,
  collection: "subcategories",
});

// SubcategorySchema.virtual('id').get(function () {
//   return this._id.toHexString();
// });
const subcategory = mongoose.model("Subcategory", SubcategorySchema);

module.exports = subcategory;
