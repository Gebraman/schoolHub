const Course = require("../models/courseModel");

exports.create = async (req, res) => {
  try {
    const { title, description } = req.body;

    await Course.createCourse(title, description, req.user.id);

    res.status(201).json({ message: "Course created" });
  } catch (err) {
    console.error("CREATE COURSE ERROR:", err);
    res.status(500).json({ message: "Failed to create course" });
  }
};

// PUBLIC: View courses
exports.list = async (req, res) => {
  const [courses] = await Course.getAllCourses();
  res.json(courses);
};

// ADMIN: Update
exports.update = async (req, res) => {
  const { title, description } = req.body;
  await Course.updateCourse(req.params.id, title, description);
  res.json({ message: "Course updated" });
};

// ADMIN: Delete
exports.remove = async (req, res) => {
  await Course.deleteCourse(req.params.id);
  res.json({ message: "Course deleted" });
};

// exports.getOne = async (req, res) => {
//   const [rows] = await Course.getById(req.params.id);
//   res.json(rows[0]);
// };
