const path = require("path");
const fs = require("fs");
const multer = require("multer");

const uploadPath = path.join(__dirname, "..", "uploads", "profile");
fs.mkdirSync(uploadPath, { recursive: true });

// --- Add this file filter function ---
const imageFileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
    req.fileValidationError = "Only image files (jpeg, jpg, png) are allowed!";
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

// --- Update the multer configuration to use the filter ---
const uploadMiddleware = multer({
  storage: storage,
  fileFilter: imageFileFilter,
});

module.exports = { uploadMiddleware };
