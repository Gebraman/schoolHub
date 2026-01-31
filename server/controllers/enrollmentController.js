const Enrollment = require("../models/enrollmentModel");

// STUDENT ENROLL IN COURSE
exports.enrollCourse = async (req, res) => {
  const userId = req.user.id;
  const courseId = req.params.courseId;

  try {
    await Enrollment.enroll(userId, courseId);

    res.json({
      message: "Enrolled successfully",
    });
  } catch (err) {
    console.error("Enrollment error:", err);

    // Duplicate enrollment (UNIQUE constraint)
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        message: "You are already enrolled in this course",
      });
    }

    res.status(500).json({
      message: "Server error",
    });
  }
};
