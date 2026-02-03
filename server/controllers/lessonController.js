const Lessons = require("../models/lessonModel");

async function createLesson(req, res) {
  // 1️⃣ Security guard check (AAU gate)

  try {
    if (!req.user || !req.user.admin) {
      return res.status(403).json({ message: "Access denied" });
    }

    // 2️⃣ Get data (lecture info)
    const { title, content } = req.body;
    const { courseId } = req.params;

    // 3️⃣ Lecturer teaches (DB action)
    await Lessons.createLesson(courseId, title, content);
    // 4️⃣ Success response
    res.status(201).json({ message: "Lesson created successfully" });
  } catch (
    err
    // 5️⃣ Something broke
  ) {
    console.error("Create lesson error:", err);
    res.status(500).json({ message: "Failed to create lesson" });
  }
}
//exports
module.exports = {
  createLesson,
};

// STUDENTS (ENROLLED)
async function listByCourse(req, res) {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // 1️⃣ Check enrollment
    const [enrolled] = await Enrollment.isEnrolled(userId, courseId);
    if (enrolled.length === 0) {
      return res
        .status(403)
        .json({ message: "You are not enrolled in this course" });
    }
    const [lessons] = await Lessons.getLessonsByCourse(courseId);
    res.json({ lessons });
  } catch (err) {
    console.error("List lessons error:", err);
    res.status(500).json({ message: "Failed to retrieve lessons" });
  }
}
//exports
module.exports.listByCourse = listByCourse;
