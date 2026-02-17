// server/controllers/scheduleController.js
const Schedule = require("../models/scheduleModel");

exports.scheduleClass = async (req, res) => {
  try {
    const { course_id, class_date, class_time, location, section } = req.body;

    const user = req.user;

    if (!course_id || !class_date || !class_time || !location || !section) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 🔒 STRICT SECURITY CHECK
    if (section !== user.section) {
      return res.status(403).json({
        message: "You can only schedule classes for your own section",
      });
    }

    await Schedule.createSchedule({
      course_id,
      department: user.department,
      section: user.section,
      year: user.year,
      class_date,
      class_time,
      location,
      created_by: user.id,
    });

    res.status(201).json({
      message: "Class scheduled successfully",
    });
  } catch (err) {
    console.error("SCHEDULE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
