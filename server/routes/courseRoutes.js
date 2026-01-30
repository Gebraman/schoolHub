const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const controller = require("../controllers/courseController");

router.post("/", auth, admin, controller.createCourse);
router.get("/", auth, controller.getCourses);

module.exports = router;
