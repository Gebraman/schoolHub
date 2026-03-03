// server/routes/scheduleRoutes.js
const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const controller = require("../controllers/scheduleController");

router.post("/", auth, role("admin"), controller.scheduleClass);
router.get("/", auth, controller.getSchedulesForStudent);

module.exports = router;
