const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const db = require("../config/db");

// GET materials for specific course (student only)

router.get("/:courseId", auth, role("student"), async (req, res) => {
  try {
    const { courseId } = req.params;
    const { department, year, section } = req.user;

    const [materials] = await db.query(
      `
      SELECT m.*
      FROM materials m
      JOIN courses c ON m.course_id = c.id
      WHERE m.course_id = ?
      AND c.department = ?
      AND c.year = ?
      AND c.section = ?
      `,
      [courseId, department, year, section],
    );

    res.json(materials);
  } catch (error) {
    console.error("Student materials error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
