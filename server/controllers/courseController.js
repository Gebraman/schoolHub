const Course = require("../models/courseModel");

exports.createCourse = async (req, res) => {
  const { title, description } = req.body;
  await Course.createCourse(title, description);
  res.json({ message: "Course created" });
};

exports.getCourses = async (req, res) => {
  const [courses] = await Course.getAllCourses();
  res.json(courses);
};
