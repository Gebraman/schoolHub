const multer = require("multer");
const { storage } = require("../config/cloudinary"); // Import Cloudinary storage

// File filter for allowed types (same as before)
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/png",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, PPT, DOC, and image files are allowed"), false);
  }
};

// Create multer upload instance with Cloudinary storage
const upload = multer({
  storage: storage, // Using Cloudinary storage instead of diskStorage
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

module.exports = upload;
