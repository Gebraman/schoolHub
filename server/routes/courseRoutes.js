const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const controller = require("../controllers/courseController");

// Admin only

router.post("/", auth, role("admin"), controller.create);
router.put("/:id", auth, role("admin"), controller.update);
router.delete("/:id", auth, role("admin"), controller.remove);

// Everyone
router.get("/", controller.list);

module.exports = router;
