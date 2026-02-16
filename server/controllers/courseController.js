const Course = require("../models/courseModel");

exports.createCourse = async (req, res) => {
  try {
    const { title, description, department, section } = req.body;
    const user = req.user; // from verifyToken middleware

    // 1️⃣ Block students
    if (user.role === "student") {
      return res.status(403).json({
        message: "Students are not allowed to create courses",
      });
    }

    // 2️⃣ Admin validation (STRICT)
    if (user.role === "admin") {
      if (department !== user.department || section !== user.section) {
        return res.status(403).json({
          message:
            "Access denied: You can only create courses for your own department and section",
        });
      }
    }

    // 4️⃣ Create course
    await Course.createCourse({
      title,
      description,
      department,
      section,
      created_by: user.id,
    });

    res.status(201).json({
      message: "Course created successfully",
    });
  } catch (err) {
    console.error("CREATE COURSE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
