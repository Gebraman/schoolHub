const express = require("express");
const app = express();
const PORT = 5000;

// Middleware to parse JSON requests - MUST BE BEFORE ROUTES
app.use(express.json());

// Simple request logger to show incoming method, path and body (helpful for debugging)
app.use((req, res, next) => {
  console.log(`--> ${req.method} ${req.path}`);
  // Only print the body for requests that include one
  if (req.body && Object.keys(req.body).length > 0) {
    console.log("Request body:", req.body);
  }
  next();
});

// Enable CORS for frontend to connect - MUST BE BEFORE ROUTES
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Import routes - MUST BE AFTER MIDDLEWARE
const routes = require("./routes/authRoutes");
app.use("/api/auth", routes);

// Health / test endpoint used during development
app.get("/ping", (req, res) => {
  res.json({ status: "ok" });
});

// Root endpoint
app.get("/", (req, res) => {
  res.send("SchoolHub backend is running! 🚀");
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  console.log(
    `📡 API endpoints available at http://localhost:${PORT}/api/auth`
  );
});
