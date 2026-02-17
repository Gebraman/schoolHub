const bcrypt = require("bcryptjs");
const registerModel = require("../models/registerModel");

exports.register = async (req, res) => {
  const { firstName, lastName, email, password, department, section, year } =
    req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !department ||
    !section ||
    !year
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if user exists
    const existingUser = await registerModel.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    await registerModel.createUser(
      firstName,
      lastName,
      email,
      hashedPassword,
      department,
      section,
      year,
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
