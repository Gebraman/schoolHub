const cron = require("node-cron");
const db = require("../config/db");

// run every 10 minutes
cron.schedule("*/10 * * * *", async () => {
  try {
    await db.query(`
      DELETE FROM class_schedules
      WHERE TIMESTAMP(class_date, class_time) < NOW() - INTERVAL  1 DAY
    `);

    console.log("Old schedules cleared");
  } catch (err) {
    console.error("Cron delete error:", err);
  }
});
