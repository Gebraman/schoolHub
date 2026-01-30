const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const controller = require("../controllers/enrollmentController");

// Student enrolls in a course
router.post("/:courseId", auth, controller.enrollCourse);

module.exports = router;
