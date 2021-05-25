const multer = require("multer");

const MIME_TYPE_MAPS = {
  "image/png": "PNG",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const extension  = MIME_TYPE_MAPS[file.mimetype];
      let error  = new Error("INVALID_TYPE");
      if (extension ) {
        error; 
      }
      cb(null, 'images')
    },
    
    filename: function (req, file, callback) {
        callback(null,Date.now() + file.originalname.toLowerCase() );
        }
})


 

module.exports = multer({ storage: storage }).single("photo");