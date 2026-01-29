const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

// Protected route example
router.get("/dashboard", auth, (req, res) => {
  res.json({
    message: "Welcome to your dashboard",
    user: req.user,
  });
});

module.exports = router;
