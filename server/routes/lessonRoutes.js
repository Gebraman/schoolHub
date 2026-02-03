const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

router.post(
  "/courses/:courseId/lessons",
  verifyToken,
  role("admin"),
  lessonController.createLesson,
);

router.get(
  "/courses/:courseId/lessons",
  verifyToken,
  role("student"),
  lessonController.listByCourse,
);
module.exports = router;
