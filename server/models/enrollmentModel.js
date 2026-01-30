const db = require("../config/db");

// Student enrolls in a course
exports.enroll = (userId, courseId) => {
  const sql = `
    INSERT INTO enrollments (user_id, course_id)
    VALUES (?, ?)
  `;
  return db.promise().query(sql, [userId, courseId]);
};
