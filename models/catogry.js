const mongoose = require("mongoose");
const { Schema } = mongoose;

const CatogrySchema = new Schema({
    name: {
        type: String,
        minlength: 3,
        maxlength: 50,
        required: true
    },
    description: {
        type: String,
        maxlength:400,
    }
}, {
    versionKey: false,
    collection: "catogries",
});

const catogry = mongoose.model("Catogry", CatogrySchema);

module.exports = catogry;