const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // 1. Get token from header
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token, access denied" });
  }

  // 2. Token format: "Bearer TOKEN"
  const token = authHeader.split(" ")[1];

  try {
    // 3. Verify token
    const decoded = jwt.verify(token, "SECRET_KEY");

    // 4. Attach user to request
    req.user = decoded;

    next(); // allow access
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
