const db = require("../config/db");
function createLesson(courseId, title, content) {
  const sql =
    "INSERT INTO Lessons (course_id, title, content) VALUES (?, ?, ?)";
  return db.promise().query(sql, [courseId, title, content]);
}
function getLessonsByCourse(courseId) {
  const sql = " SELECT * FROM Lessons WHERE course_id = ?";
  return db.promise().query(sql, [courseId]);
}
//exportss
module.exports = {
  createLesson,
  getLessonsByCourse,
};
