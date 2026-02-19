const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const controller = require("../controllers/courseController");
const db = require("../config/db");

router.get("/", auth, role("student"), controller.getStudentCourses);

module.exports = router;
