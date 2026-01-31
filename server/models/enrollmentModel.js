const db = require("../config/db");

exports.enroll = (userId, courseId) => {
  const sql = `
    INSERT INTO enrollments (user_id, course_id)
    VALUES (?, ?)
  `;
  return db.promise().query(sql, [userId, courseId]);
};

exports.getMyCourses = (userId) => {
  const sql = `
    SELECT c.id, c.title, c.description
    FROM courses c
    JOIN enrollments e ON c.id = e.course_id
    WHERE e.user_id = ?
  `;
  return db.promise().query(sql, [userId]);
};
