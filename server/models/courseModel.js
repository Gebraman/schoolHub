const db = require("../config/db");

exports.createCourse = (title, description, department, section, adminId) => {
  const sql =
    "INSERT INTO courses (title, description, department, section, created_by) VALUES (?, ?, ?, ?, ?)";
  return db
    .promise()
    .query(sql, [title, description, department, section, adminId]);
};

exports.getAllCourses = () => {
  return db.promise().query("SELECT * FROM courses");
};
exports.getCourseById = (id) => {
  const sql = "SELECT * FROM courses WHERE id = ?";
  return db.promise().query(sql, [id]);
};

exports.updateCourse = (id, title, description) => {
  const sql = "UPDATE courses SET title = ?, description = ? WHERE id = ?";
  return db.promise().query(sql, [title, description, id]);
};
exports.deleteCourse = (id) => {
  const sql = "DELETE FROM courses WHERE id = ?";
  return db.promise().query(sql, [id]);
};
// PUBLIC: View courses
exports.list = async (req, res) => {
  const [courses] = await Course.getAllCourses();
  res.json(courses);
};

// exports.getById = (id) => {
//   return db.promise().query("SELECT * FROM courses WHERE id = ?", [id]);
// };
