const express = require("express");
const router = express.Router();

// In-memory storage for users (in production, use a database)
let users = [];

// ============================================
// REGISTER ROUTE
// POST /api/auth/register
// ============================================
router.post("/register", (req, res) => {
  console.log("📥 Registration request received");
  console.log("Request body:", req.body);

  // Check if body exists
  if (!req.body) {
    console.error("❌ No request body received");
    return res.status(400).json({ message: "No data received" });
  }

  const { name, email, password } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    console.error("❌ Missing required fields:", {
      name,
      email,
      password: !!password,
    });
    return res
      .status(400)
      .json({ message: "Name, email, and password are required" });
  }

  // Check if user already exists
  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    console.log("❌ User already exists:", email);
    return res.status(400).json({ message: "User already exists" });
  }

  // Create new user with an id and default fields
  const id = Date.now();
  const newUser = {
    id,
    name,
    email,
    password,
    role: "student",
    courses: [],
    profileImage: null,
  };
  users.push(newUser);
  console.log("✅ User registered successfully:", email);
  console.log("Total users:", users.length);

  // Return created user so frontend can persist/use the server-assigned id
  res
    .status(201)
    .json({ message: "User registered successfully", user: newUser });
});

// ============================================
// LOGIN ROUTE
// POST /api/auth/login
// ============================================
router.post("/login", (req, res) => {
  console.log("📥 Login request received");
  console.log("Request body:", req.body);

  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // Find user
  const user = users.find((user) => user.email === email);
  if (!user) {
    console.log("❌ User not found:", email);
    return res.status(400).json({ message: "User not found" });
  }

  // Check password
  if (user.password !== password) {
    console.log("❌ Invalid password for:", email);
    return res.status(400).json({ message: "Invalid password" });
  }

  console.log("✅ Login successful for:", email);
  // Return the user object for convenience (beware of sending passwords in production)
  res.status(200).json({ message: "Login successful", user });
});

module.exports = router;
