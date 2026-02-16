const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMaterialMiddleware");
const controller = require("../controllers/materialController");

router.post(
  "/",
  auth,
  role("admin"),
  upload.single("file"),
  controller.uploadMaterial,
);

module.exports = router;
