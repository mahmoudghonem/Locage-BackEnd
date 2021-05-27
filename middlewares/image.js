const multer = require("multer");
const CustomError = require('../functions/errorHandler');
const path = require("path");
// Multer config
module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png" && ext !== ".gif") {
      cb(new CustomError("INVALID_TYPE"), false);
      return;
    }
    cb(null, true);
  },
});