const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const dashboardController = require("../controllers/dashboardController");

router.get("/student", auth, dashboardController.studentDashboard);

module.exports = router;
