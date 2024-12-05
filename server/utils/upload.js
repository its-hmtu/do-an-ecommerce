const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = req.upload_path;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {recursive: true});
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const parts = file.originalname.split('.');
    const extension = parts[parts.length - 1];
    let fileName = file.fieldname + '-' + Date.now();
    if (extension === 'png' || extension === 'jpg' || extension === 'jpeg' || extension === 'webp') {
      fileName += '.' + extension;
    }

    cb(null, fileName);
  }
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 10 }
});

module.exports = upload;