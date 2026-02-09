const db = require("../config/db");

/**
 * Create a new user
 * REAL LIFE: "Save a new user into the database"
 */

// After (updated code)

function createUser(
  firstName,
  lastName,
  email,
  password,
  department,
  section,
  role = "student",
) {
  const sql = `
    INSERT INTO users (firstName, lastName, email, password, department, section, role)
    VALUES (?, ?, ?, ?,?, ?, ?)
  `;

  return new Promise((resolve, reject) => {
    db.query(
      sql,
      [firstName, lastName, email, password, department, section, role],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      },
    );
  });
}

/**
 * Find user by email
 * REAL LIFE: "Check if user already exists"
 */
function findUserByEmail(email) {
  const sql = `SELECT * FROM users WHERE email = ?`;

  return new Promise((resolve, reject) => {
    db.query(sql, [email], (err, rows) => {
      if (err) return reject(err);
      resolve(rows[0]); // one user only
    });
  });
}

module.exports = {
  createUser,
  findUserByEmail,
};
