// server/models/courseModel.js
const db = require("../config/db");

exports.createCourse = ({
  title,
  description,
  department,
  section,
  created_by,
}) => {
  const sql =
    "INSERT INTO courses (title, description, department, section, created_by) VALUES (?, ?, ?, ?, ?)";
  return db
    .promise()
    .query(sql, [title, description, department, section, created_by]);
};
exports.getCoursesByAdmin = (adminId) => {
  const sql = "SELECT id, title FROM courses WHERE created_by = ?";
  return db.promise().query(sql, [adminId]);
};
