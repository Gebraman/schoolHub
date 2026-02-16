const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const controller = require("../controllers/courseController");

router.post("/", auth, role("admin"), controller.createCourse);
router.get("/", auth, role("admin"), controller.getAdminCourses);

module.exports = router;
