const db = require("../config/db");
const Course = require("../models/courseModel");

exports.createCourse = async (req, res) => {
  try {
    const { title, description, department, section, year } = req.body;
    const user = req.user; // from verifyToken middleware

    // Check if user exists
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized: User not found",
      });
    }

    // 1️⃣ Block students
    if (user.role === "student") {
      return res.status(403).json({
        message: "Students are not allowed to create courses",
      });
    }

    // 2️⃣ Admin validation (STRICT)
    if (user.role === "admin") {
      // Check if admin's department and section are defined
      if (!user.department || !user.section || !year) {
        return res.status(403).json({
          message: "Access denied: Admin department, section  and year not set",
        });
      }

      if (
        department !== user.department ||
        section !== user.section ||
        year !== user.year
      ) {
        return res.status(403).json({
          message:
            "Access denied: You can only create courses for your own department,section and year",
        });
      }
    }

    // 3️⃣ Create course
    await Course.createCourse({
      title,
      description,
      department,
      section,
      year,
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
exports.getAdminCourses = async (req, res) => {
  try {
    const user = req.user;

    const courses = await Course.getCoursesByAdmin(user.id);
    res.json(courses);
  } catch (err) {
    console.error("GET COURSES ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get courses for a student by department, year, and section
exports.getStudentCourses = async ({ department, year, section }) => {
  const sql =
    "SELECT * FROM courses WHERE department = ? AND year = ? AND section = ?";
  const [rows] = await db.query(sql, [department, year, section]);
  return rows;
};
