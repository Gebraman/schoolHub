const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const Enrollment = require("../models/enrollmentModel");

// Student enrolls in a course
router.post("/:courseId", auth, async (req, res) => {
  await Enrollment.enroll(req.user.id, req.params.courseId);
  res.json({ message: "Enrolled successfully" });
});

module.exports = router;
