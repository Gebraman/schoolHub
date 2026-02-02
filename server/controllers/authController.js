const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
require("dotenv").config();

// REGISTER
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 1. Check if user exists
    const existingUser = await userModel.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // 3. Save user
    await userModel.createUser(name, email, hashedPassword);

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // 1. Find user
    const user = await userModel.findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }
    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, role: user.role },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
  // 3. Create JWT (include user name so frontend can show it without extra requests)
  const token = jwt.sign(
    { id: user.id, role: user.role, name: user.name },
    process.env.JWT_SECRET || "SECRET_KEY",
    { expiresIn: "1h" },
  );
};
