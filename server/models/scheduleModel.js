// server/models/scheduleModel.js
const db = require("../config/db");

exports.createSchedule = async ({
  course_id,
  department,
  section,
  year,
  class_date,
  class_time,
  location,
  created_by,
}) => {
  const sql = `
    INSERT INTO class_schedules
    (course_id, department, section, year, class_date, class_time, location, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const [result] = await db.query(sql, [
    course_id,
    department,
    section,
    year,
    class_date,
    class_time,
    location,
    created_by,
  ]);
  return result;
};
