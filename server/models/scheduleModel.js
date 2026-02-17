// server/models/scheduleModel.js
const db = require("../config/db");

exports.createSchedule = ({
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

  return db
    .promise()
    .query(sql, [
      course_id,
      department,
      section,
      year,
      class_date,
      class_time,
      location,
      created_by,
    ]);
};
