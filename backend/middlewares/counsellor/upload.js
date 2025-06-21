const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure folder exists
const dir = path.join(__dirname, '../static/images');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, dir),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

module.exports = upload;
