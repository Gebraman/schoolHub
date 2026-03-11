require("dotenv").config();

// Fail fast if required env vars are missing (helps developers avoid runtime errors)
const requiredEnv = ["JWT_SECRET", "DB_HOST", "DB_USER", "DB_PASS", "DB_NAME"];
const missingEnv = requiredEnv.filter(
  (k) => !process.env[k] || process.env[k].toString().trim() === "",
);
if (missingEnv.length) {
  console.error(
    `Missing required env variables: ${missingEnv.join(", ")}. Please copy .env.example to .env and set them.`,
  );
  process.exit(1);
}

const express = require("express");
const path = require("path");
const db = require("./config/db");
const cors = require("cors");
const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

// Serve client static files (optional but helpful during development)
app.use(express.static(path.join(__dirname, "../client")));

const port = process.env.PORT || 3000;
app.get("/ping", (req, res) => {
  res.send("pong");
});
app.get("/", (req, res) => {
  res.send("the schoolhub server is running here");
});

const registerRoute = require("./routes/registerRoute");
const loginRoute = require("./routes/loginRoute");
const courseRoutes = require("./routes/courseRoutes");
const materialRoutes = require("./routes/materialRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const studentCourseRoutes = require("./routes/studentCourseRoutes");
const studentMaterialRoutes = require("./routes/studentMaterialRoutes");
const studentAssignmentRoutes = require("./routes/studentAssignmentRoutes");
const contactRoutes = require("./routes/contactRoutes");
const reminderJob = require("./jobs/classReminderJob");

app.use("/api/contact", contactRoutes);

app.use("/api/auth", registerRoute);
app.use("/api/auth", loginRoute);
app.use("/api/courses", courseRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/student/courses", studentCourseRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/student/materials", studentMaterialRoutes);
app.use("/api/student/assignments", studentAssignmentRoutes);
require("./jobs/clearOldSchedules");
// Push notification routes
app.post("/api/push/subscribe", async (req, res) => {
  try {
    const { subscription, department, section, year } = req.body;

    // Get user info from JWT token (you have this in your auth)
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Verify token and get user (you can reuse your existing auth)
    const jwt = require("jsonwebtoken");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const id = await reminderJob.addSubscription(
      subscription,
      department,
      section,
      year,
    );

    res.json({ success: true, subscriptionId: id });
  } catch (error) {
    console.error("Subscription error:", error);
    res.status(500).json({ message: "Subscription failed" });
  }
});

// Return JSON 404 for unknown API routes (helps clients parse errors)
app.use("/api", (req, res) => {
  res.status(404).json({ message: "API route not found" });
});

// Global error handler (returns JSON for unexpected errors)
app.use((err, req, res, next) => {
  console.error(err && err.stack ? err.stack : err);
  if (res.headersSent) return next(err);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`The SchoolHub server is running on port ${port}`);
  reminderJob.startReminderJob(1);
});
