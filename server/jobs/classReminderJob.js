const cron = require("node-cron");
const db = require("../config/db");
const webpush = require("web-push");

const publicKey =
  "BFuEaumG9U1edPSKctlkBVY0b6u8ad0EXZMU0L8DhE7qQr6BXwu_RYJpvUkI6mkWtxDFjXMyLdt27PD8Cwqhk0k";
const privateKey = "ThTFs_EA_WHFkq01lU6PIhDX5BTyUWae_IHHGe_rAqc";

webpush.setVapidDetails("mailto:test@test.com", publicKey, privateKey);

cron.schedule("* * * * *", async () => {
  try {
    const [classes] = await db.query(`
      SELECT cs.*, c.title AS course_title
      FROM class_schedules cs
      JOIN courses c ON cs.course_id = c.id
      WHERE cs.reminder_sent = FALSE
      AND TIMESTAMP(cs.class_date, cs.class_time)
      BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 25 MINUTE)
    `);

    for (const cls of classes) {
      const payload = JSON.stringify({
        title: "Class Reminder",
        body: `${cls.course_title} starts in 25 minutes at ${cls.location}`,
        icon: "http://localhost:5500/pages/assets/bell.png",
      });

      const [subs] = await db.query(
        "SELECT subscription FROM push_subscriptions WHERE section = ?",
        [cls.section],
      );

      for (const sub of subs) {
        try {
          const subscription = JSON.parse(sub.subscription);
          await webpush.sendNotification(subscription, payload);
        } catch (err) {
          console.error("Push send error:", err);
        }
      }

      await db.query(
        "UPDATE class_schedules SET reminder_sent = TRUE WHERE id = ?",
        [cls.id],
      );
    }

    console.log("Reminder check complete");
  } catch (err) {
    console.error("Reminder job error:", err);
  }
});
