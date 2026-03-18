// In server/controllers/materialController.js

const Material = require("../models/materialModel");
const path = require("path");

exports.uploadMaterial = async (req, res) => {
  try {
    const { course_id, title } = req.body;
    const user = req.user;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // 🔍 DEBUG: See what Cloudinary returned
    console.log("📁 File uploaded to Cloudinary:", req.file.path);
    console.log("📁 Original filename:", req.file.originalname);

    await Material.createMaterial({
      course_id,
      title,
      file_path: req.file.path,
      file_name: req.file.originalname, // ✅ ADD THIS LINE
      file_type: req.file.mimetype,
      uploaded_by: user.id,
    });

    res.status(201).json({
      message: "Material uploaded successfully",
      fileUrl: req.file.path, // Optional: return URL to frontend
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
