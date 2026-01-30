const db = require("../config/db");

exports.createCourse = (title, description) => {
  const sql = "INSERT INTO courses (title, description) VALUES (?, ?)";
  return db.promise().query(sql, [title, description]);
};

exports.getAllCourses = () => {
  return db.promise().query("SELECT * FROM courses");
};
