const db = require("../config/db");

exports.studentDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1️⃣ Get user info
    const [users] = await db
      .promise()
      .query("SELECT id, name, role FROM users WHERE id = ?", [userId]);

    // 2️⃣ Get enrolled courses
    const [courses] = await db.promise().query(
      `
      SELECT c.id, c.title, c.description
      FROM courses c
      JOIN enrollments e ON e.course_id = c.id
      WHERE e.user_id = ?
      `,
      [userId],
    );

    res.json({
      user: users[0],
      courses,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
