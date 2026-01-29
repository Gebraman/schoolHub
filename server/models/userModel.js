const db = require("../config/db");

/**
 * Create a new user
 * REAL LIFE: "Save a new user into the database"
 */
function createUser(name, email, password, role = "student") {
  const sql = `
    INSERT INTO users (name, email, password, role)
    VALUES (?, ?, ?, ?)
  `;

  return new Promise((resolve, reject) => {
    db.query(sql, [name, email, password, role], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
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
  findUserByEmail
};
