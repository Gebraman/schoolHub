const express = require("express");
const router = express.Router();
const multer = require("multer");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const { uploadAssignment } = require("../controllers/assignmentController");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/assignments/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/", auth, role("admin"), upload.single("file"), uploadAssignment);

module.exports = router;
