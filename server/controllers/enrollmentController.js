const Enrollment = require("../models/enrollmentModel");

exports.enrollCourse = async (req, res) => {
  try {
    const userId = req.user.id;
    const courseId = req.params.courseId;

    await Enrollment.enroll(userId, courseId);

    res.json({ message: "Enrolled successfully" });
  } catch (err) {
    console.error("Enroll error:", err);
    res.status(500).json({ message: "Enrollment failed" });
  }
};
