const multer = require('multer');

// How to store the file (storing startegy)
const storage = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, './images/')
    },
    filename: function(req, file, callback){
        callback(null, Date.now() + file.originalname)
    }
});

const fileFilter = (req, file, cb) => {
    const mimeTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'application/octet-stream'
    ]
    if(mimeTypes.findIndex(item => item === file.mimetype) !== -1)
        cb(null, true);
    else cb(new Error("INVALID_FILETYPE"), false);
}

const upload = multer({ storage: storage, fileFilter: fileFilter }).array('photos', 10);

module.exports = upload;