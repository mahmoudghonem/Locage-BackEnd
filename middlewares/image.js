const multer = require("multer");
const CustomError = require('../functions/errorHandler');
const path = require("path");
// Multer config
module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png" && ext !== ".gif" && ext !== ".jfif") {
      cb(new CustomError("INVALID_TYPE"), false);
      return;
    }
    cb(null, true);
  },
});