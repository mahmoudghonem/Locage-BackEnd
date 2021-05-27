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
    versionKey: false,
    collection: "subcategories",
});

const subcategory = mongoose.model("Subcategory", SubcategorySchema);

module.exports = subcategory;
