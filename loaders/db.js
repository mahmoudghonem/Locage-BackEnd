
const mongoose = require('mongoose');
// eslint-disable-next-line no-undef
const { MONGO_URI } = process.env;

const connectionOptions = {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
};
mongoose.connect(MONGO_URI, connectionOptions).then(() =>
    console.log("Database Connected Successfully"))
    .catch(err => console.log(err));
mongoose.Promise = global.Promise;

module.exports = { mongoose };
