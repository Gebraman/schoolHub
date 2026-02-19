// server/models/courseModel.js
const db = require("../config/db");

exports.createCourse = async ({
  title,
  description,
  department,
  section,
  year,
  created_by,
}) => {
  const sql =
    "INSERT INTO courses (title, description, department, section, year, created_by) VALUES (?, ?, ?, ?, ?, ?)";
  const [result] = await db.query(sql, [
    title,
    description,
    department,
    section,
    year,
    created_by,
  ]);
  return result;
};

exports.getCoursesByAdmin = async (adminId) => {
  const sql = "SELECT id, title FROM courses WHERE created_by = ?";
  const [rows] = await db.query(sql, [adminId]);
  return rows;
};
