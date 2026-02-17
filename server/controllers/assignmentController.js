const Assignment = require("../models/assignmentModel");

exports.uploadAssignment = async (req, res) => {
  try {
    const { course_id, title, deadline } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    await Assignment.createAssignment({
      course_id,
      title,
      file_path: req.file.path,
      file_type: req.file.mimetype,
      file_name: req.file.originalname,
      deadline,
      uploaded_by: req.user.id,
    });

    res.status(201).json({
      message: "Assignment uploaded successfully",
    });
  } catch (err) {
    console.error("UPLOAD ASSIGNMENT ERROR:", err);
    res.status(500).json({
      message: "Server error",
    });
  }
};
