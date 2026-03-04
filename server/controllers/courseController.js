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

exports.getStudentCourses = async (req, res) => {
  try {
    console.log("JWT USER:", req.user);

    const department = req.user.department.trim();
    // const section = req.user.section.trim();
    const year = parseInt(req.user.year); // 🔥 IMPORTANT

    const sql = `
      SELECT * FROM courses
      WHERE department = ?
      AND year = ?
    `;

    const [rows] = await db.query(sql, [department, year]);

    res.json(rows);
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getAdminDepartmentCourses = async (req, res) => {
  try {
    // Check role
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const department = req.user.department;
    const year = req.user.year;
    const [courses] = await db.execute(
      "SELECT * FROM courses WHERE department = ? AND year = ?",
      [department, year],
    );

    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getAdminCourseDetails = async (req, res) => {
  try {
    const courseId = req.params.id;
    const department = req.user.department;
    const year = req.user.year;
    // 1️⃣ Get course (must belong to admin department)
    const [course] = await db.execute(
      "SELECT * FROM courses WHERE id = ? AND department = ? AND year = ?",
      [courseId, department, year],
    );

    if (!course.length) {
      return res.status(404).json({ message: "Course not found" });
    }

    // 2️⃣ Get materials
    const [materials] = await db.execute(
      "SELECT * FROM materials WHERE course_id = ?",
      [courseId],
    );

    // 3️⃣ Get assignments
    const [assignments] = await db.execute(
      "SELECT * FROM assignments WHERE course_id = ?",
      [courseId],
    );

    res.json({
      course: course[0],
      materials,
      assignments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
