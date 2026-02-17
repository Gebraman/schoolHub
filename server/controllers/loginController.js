const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const loginModel = require("../models/loginModel");
require("dotenv").config();

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  try {
    // Find user
    const user = await loginModel.findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Create token
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        firstName: user.firstName,
        department: user.department,
        section: user.section,
        year: user.year,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        role: user.role,
        department: user.department,
        section: user.section,
        year: user.year,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
