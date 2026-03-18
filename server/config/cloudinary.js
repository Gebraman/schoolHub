// server/config/cloudinary.js
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure storage for file uploads
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "edusphere",
    resource_type: "auto",
    public_id: (req, file) => {
      // Create unique filename without extension
      const name = file.originalname.replace(/\.[^/.]+$/, "");
      return `${Date.now()}-${name}`;
    },
  },
});

module.exports = { cloudinary, storage };
