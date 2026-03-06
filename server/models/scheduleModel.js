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
// exports.getSchedulesByFilter = async ({
//   course_id,
//   department,
//   section,
//   year,
// }) => {
//   const result = await db.query(
//     `SELECT * FROM class_schedules
//      WHERE course_id = ?
//      AND department = ?
//      AND section = ?
//      AND year = ?
//      ORDER BY class_date ASC`,
//     [course_id, department, section, year],
//   );

//   return result[0];
// };

exports.getSchedulesByFilter = async ({ department, section, year }) => {
  const result = await db.query(
    `SELECT 
        cs.*,
        c.title AS course_title
     FROM class_schedules cs
     JOIN courses c ON cs.course_id = c.id
     WHERE cs.department = ?
     AND cs.section = ?
     AND cs.year = ?
     ORDER BY cs.class_date ASC`,
    [department, section, year],
  );

  return result[0];
};
