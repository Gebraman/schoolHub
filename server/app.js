require("dotenv").config();
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

app.get("/", (req, res) => {
  res.send("the schoolhub server is running here");
});

// Protected user routes
app.use("/api/user", require("./routes/userRoutes"));

// Protected course routes
app.use("/api/courses", require("./routes/courseRoutes"));
// Protected enrollment routes
app.use("/api/enrollments", require("./routes/enrollmentRoutes"));

// Protected dashboard routes
app.use("/api/dashboard", require("./routes/dashboardRoutes"));

// Auth routes (register/login)
app.use("/api/auth", require("./routes/authRoutes"));

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

app.listen(port, () => {
  console.log(`the schoolhub server is running on port ${port}`);
});
