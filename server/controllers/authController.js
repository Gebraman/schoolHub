const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
require("dotenv").config();

// REGISTER
exports.register = async (req, res) => {
  const { firstName, lastName, email, password, department, section } =
    req.body;

  try {
    // 1. Check if user exists
    const existingUser = await userModel.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // 3. Save user
    await userModel.createUser(
      firstName,
      lastName,
      email,
      hashedPassword,
      department,
      section,
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Register error:", err);

    // Handle common DB errors cleanly (e.g. duplicate email)
    if (err && err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "Email already registered" });
    }

    // In development return the detailed message to help debugging
    if (process.env.NODE_ENV !== "production") {
      return res.status(500).json({ message: err.message || "Server error" });
    }

    // Generic error for production
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

    // 3. Create JWT (include user name so frontend can show it without extra requests)
    if (!process.env.JWT_SECRET) {
      console.error(
        "Login error: JWT_SECRET is not set. Please add it to your .env",
      );
      return res
        .status(500)
        .json({ message: "Server configuration error: JWT secret not set" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name,
        department: user.department,
        section: user.section,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    // 4. Send response with token
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        department: user.department,
        section: user.section,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    if (process.env.NODE_ENV !== "production") {
      return res.status(500).json({ message: err.message || "Server error" });
    }
    res.status(500).json({ message: "Server error" });
  }
};
