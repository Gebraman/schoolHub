const express = require("express");
const router = express.Router();
const db = require("../config/db");
const webpush = require("web-push");

router.get("/test", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM push_subscriptions LIMIT 1");

  if (rows.length === 0) {
    return res.send("No subscriptions found");
  }

  const subscription = JSON.parse(rows[0].subscription);

  const payload = JSON.stringify({
    title: "EduSphere Test",
    body: "Push notification works 🎉",
  });

  try {
    await webpush.sendNotification(subscription, payload);
    res.send("Push sent!");
  } catch (err) {
    console.error(err);
    res.send("Push failed");
  }
});

module.exports = router;
