const express = require("express");
const db = require("./config/db");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
const port = 3000;
app.get("/", (req, res) => {
  res.send("the schoolhub server is running here");
});
// Register routes before starting the server
app.use("/api/auth", require("./routes/authRoutes"));

// Return JSON 404 for unknown API routes (helps clients parse errors)
app.use("/api", (req, res) => {
  res.status(404).json({ message: "API route not found" });
});

app.listen(port, () => {
  console.log(`the schoolhub server is running on port ${port}`);
});

// Global error handler (returns JSON for unexpected errors)
app.use((err, req, res, next) => {
  console.error(err && err.stack ? err.stack : err);
  if (res.headersSent) return next(err);
  res.status(500).json({ message: "Internal server error" });
});
