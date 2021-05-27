const mongoose = require("mongoose");
const { Schema } = mongoose;

const SubcategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    maxlength: 50,
    unique: true,
  },
  description: {
    type: String,
    required: true,
    maxlength: 50,
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: "categorys",
  },
}, {
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  },
  versionKey: false,
  collection: "subcategories",
});
SubcategorySchema.virtual('id').get(function () {
  return this._id.toHexString();
});
const subcategory = mongoose.model("Subcategory", SubcategorySchema);

module.exports = subcategory;
