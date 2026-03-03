const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../middleware/authMiddleware");
// GET assignments for logged-in student

router.get("/", auth, async (req, res) => {
  try {
    const { department, year, section } = req.user;

    const [assignments] = await db.query(
      `
      SELECT a.id, a.title, a.file_path, a.file_name, 
             a.file_type, a.deadline
      FROM assignments a
      JOIN courses c ON a.course_id = c.id
      WHERE c.department = ? 
        AND c.year = ? 
        AND c.section = ?
      ORDER BY a.deadline ASC
      `,
      [department, year, section],
    );

    res.json(assignments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
