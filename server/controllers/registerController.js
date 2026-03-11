const bcrypt = require("bcryptjs");
const registerModel = require("../models/registerModel");
const EmailVerificationService = require("../services/emailVerification");

// Initialize email verification service
const emailVerifier = new EmailVerificationService(
  process.env.MAILSNIPER_API_KEY,
);

exports.register = async (req, res) => {
  const { firstName, lastName, email, password, department, section, year } =
    req.body;

  // Basic validation
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
    // 🔥 STEP 1: Check if user exists
    const existingUser = await registerModel.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 🔥 STEP 2: Verify email with MailSniper
    console.log(`🔍 Verifying email: ${email}`);
    const verification = await emailVerifier.verifyEmail(email);

    // 🔥 STEP 3: Handle API errors (fail open)
    if (!verification.success) {
      console.warn(
        "⚠️ Email verification service issue:",
        verification.message,
      );
      // Continue registration but log the issue
      // You can still allow registration if the API is down
    }
    // 🔥 STEP 4: Make decision based on verification results
    else {
      const decision = emailVerifier.shouldAllowRegistration(verification);

      if (!decision.allowed) {
        console.log("🚫 Registration blocked:", decision.reasons);
        return res.status(400).json({
          message: decision.reasons.join(". "),
        });
      }

      // Log successful verification
      console.log("✅ Email verified:", {
        email: verification.email,
        isValid: verification.isValid,
        isDisposable: verification.isDisposable,
        risk: verification.risk,
      });

      // 🔥 OPTIONAL: Check if credits are running low
      if (
        verification.creditsRemaining &&
        verification.creditsRemaining < 1000
      ) {
        console.warn(
          `⚠️ Low credits: ${verification.creditsRemaining} remaining`,
        );
        // You could notify admin here
      }
    }

    // 🔥 STEP 5: Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔥 STEP 6: Save user
    await registerModel.createUser(
      firstName,
      lastName,
      email,
      hashedPassword,
      department,
      section,
      year,
    );

    // 🔥 STEP 7: Send success response
    res.status(201).json({
      message: "User registered successfully",
      // Optional: include verification status
      verified: verification.success ? true : false,
    });
  } catch (err) {
    console.error("❌ Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔥 OPTIONAL: Add endpoint to check API usage
exports.checkApiUsage = async (req, res) => {
  try {
    const usage = await emailVerifier.checkUsage();
    res.json(usage);
  } catch (error) {
    console.error("Usage check error:", error);
    res.status(500).json({ message: "Failed to check usage" });
  }
};
