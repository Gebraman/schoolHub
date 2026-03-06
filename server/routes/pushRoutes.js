const express = require("express");
const router = express.Router();
const controller = require("../controllers/pushController");
const auth = require("../middleware/authMiddleware");

router.get("/public-key", controller.getPublicKey);
router.post("/subscribe", auth, controller.subscribeUser);

module.exports = router;
