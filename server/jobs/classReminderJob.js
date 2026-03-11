// jobs/classReminderJob.js
const webpush = require("web-push");
const db = require("../config/db");
require("dotenv").config();

// Configure web-push with VAPID keys from .env
webpush.setVapidDetails(
  process.env.VAPID_EMAIL,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY,
);

// Check for upcoming classes and send reminders

// Check for upcoming classes and send reminders
async function checkUpcomingClasses() {
  console.log("\n🔍 Checking for upcoming classes...");

  try {
    const now = new Date();

    // 🔥 CHANGED: From 5 minutes to 20 minutes
    const twentyMinutesLater = new Date(now.getTime() + 20 * 60000);

    // Get current time in 24-hour format for MySQL
    const currentTime =
      now.getHours().toString().padStart(2, "0") +
      ":" +
      now.getMinutes().toString().padStart(2, "0") +
      ":" +
      now.getSeconds().toString().padStart(2, "0");

    // 🔥 CHANGED: Using twentyMinutesLater instead of fiveMinutesLater
    const futureTime =
      twentyMinutesLater.getHours().toString().padStart(2, "0") +
      ":" +
      twentyMinutesLater.getMinutes().toString().padStart(2, "0") +
      ":" +
      twentyMinutesLater.getSeconds().toString().padStart(2, "0");

    const currentDate = now.toISOString().split("T")[0];

    console.log(`📅 Current date: ${currentDate}`);
    console.log(`⏰ Current time: ${currentTime}`);
    // 🔥 CHANGED: Updated log message
    console.log(`⏰ Future time (20 min later): ${futureTime}`);

    // 🔥 CHANGED: Updated comment
    // Find classes starting in next 20 minutes
    const [classes] = await db.execute(
      `
      SELECT 
        cs.*
      FROM class_schedules cs
      WHERE cs.class_date = ?
        AND cs.class_time BETWEEN ? AND ?
        AND cs.reminder_sent = 0
    `,
      [currentDate, currentTime, futureTime],
    );

    console.log(
      `📚 Found ${classes.length} classes starting in the next 20 minutes`,
    );

    if (classes.length > 0) {
      console.log(
        "Classes found:",
        classes.map((c) => ({
          id: c.id,
          time: c.class_time,
          course_id: c.course_id,
        })),
      );
    }

    for (const classItem of classes) {
      await sendClassReminders(classItem);
      await db.execute(
        "UPDATE class_schedules SET reminder_sent = 1 WHERE id = ?",
        [classItem.id],
      );
    }
  } catch (error) {
    console.error("❌ Error checking classes:", error);
  }
}

// Send push notifications to subscribers
async function sendClassReminders(classItem) {
  try {
    // Get course details
    const [courseResult] = await db.execute(
      `
      SELECT title 
      FROM courses 
      WHERE id = ?
    `,
      [classItem.course_id],
    );

    const course = courseResult[0] || { title: "Class" };

    console.log(
      `📋 Course found: ${course.title} for class ID ${classItem.id}`,
    );

    // Get subscribers for this department/section/year
    const [subscribers] = await db.execute(
      `
      SELECT id, subscription 
      FROM push_subscriptions 
      WHERE department = ? 
        AND section = ? 
        AND year = ?
    `,
      [classItem.department, classItem.section, classItem.year],
    );

    if (subscribers.length === 0) {
      console.log(`⚠️ No subscribers for ${course.title}`);
      return;
    }

    console.log(
      `👥 Found ${subscribers.length} subscribers for ${course.title}`,
    );

    // 🔥 ONLY CHANGE: "5 minutes" → "20 minutes"
    const notificationPayload = {
      title: "📚 Class Reminder",
      body: `${course.title} starts in 20 minutes at ${classItem.location}`,
      icon: "/icon.png",
      data: {
        classId: classItem.id,
        courseName: course.title,
        location: classItem.location,
        department: classItem.department,
        section: classItem.section,
        year: classItem.year,
        type: "class-reminder",
      },
    };

    let successCount = 0;
    let failCount = 0;

    for (const sub of subscribers) {
      try {
        let subscription;

        if (typeof sub.subscription === "string") {
          if (sub.subscription === "[object Object]") {
            await db.execute("DELETE FROM push_subscriptions WHERE id = ?", [
              sub.id,
            ]);
            continue;
          }

          try {
            subscription = JSON.parse(sub.subscription);
          } catch (parseError) {
            await db.execute("DELETE FROM push_subscriptions WHERE id = ?", [
              sub.id,
            ]);
            continue;
          }
        } else {
          subscription = sub.subscription;
        }

        if (!subscription || !subscription.endpoint) {
          await db.execute("DELETE FROM push_subscriptions WHERE id = ?", [
            sub.id,
          ]);
          continue;
        }

        await webpush.sendNotification(
          subscription,
          JSON.stringify(notificationPayload),
        );
        successCount++;
      } catch (error) {
        failCount++;
        if (error.statusCode === 410) {
          await db.execute("DELETE FROM push_subscriptions WHERE id = ?", [
            sub.id,
          ]);
        }
      }
    }

    console.log(`📊 Summary: ${successCount} successful, ${failCount} failed`);
  } catch (error) {
    console.error("❌ Error sending reminders:", error);
  }
}

// Add new subscription
async function addSubscription(subscription, department, section, year) {
  try {
    const subscriptionJson = JSON.stringify(subscription);

    const [existing] = await db.execute(
      "SELECT id FROM push_subscriptions WHERE subscription = ?",
      [subscriptionJson],
    );

    if (existing.length > 0) {
      console.log("📋 Subscription already exists");
      return existing[0].id;
    }

    const [result] = await db.execute(
      `INSERT INTO push_subscriptions 
       (subscription, department, section, year) 
       VALUES (?, ?, ?, ?)`,
      [subscriptionJson, department, section, year],
    );

    console.log(`✅ New subscription added with ID: ${result.insertId}`);
    return result.insertId;
  } catch (error) {
    console.error("❌ Error adding subscription:", error);
    throw error;
  }
}

// Start the reminder job
function startReminderJob(intervalMinutes = 1) {
  console.log(
    `🚀 Class reminder job started (checking every ${intervalMinutes} minute)`,
  );
  checkUpcomingClasses();
  setInterval(checkUpcomingClasses, intervalMinutes * 60 * 1000);
}

module.exports = {
  addSubscription,
  startReminderJob,
  checkUpcomingClasses,
};
