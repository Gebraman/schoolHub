const db = require("../config/db");

// exports.findUserByEmail = (email) => {
//   return new Promise((resolve, reject) => {
//     db.query("SELECT * FROM users WHERE email = ?", [email], (err, rows) => {
//       if (err) return reject(err);
//       resolve(rows[0]);
//     });
//   });
// };

exports.findUserByEmail = async (email) => {
  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0];
};

// exports.createUser = (
//   firstName,
//   lastName,
//   email,
//   password,
//   department,
//   section,
//   year,
//   role = "student",
// ) => {
//   return new Promise((resolve, reject) => {
//     db.query(
//       `INSERT INTO users
//       (firstName, lastName, email, password, department, section, year, role)
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
//       [firstName, lastName, email, password, department, section, year, role],
//       (err, result) => {
//         if (err) return reject(err);
//         resolve(result);
//       },
//     );
//   });
// };
exports.createUser = async (
  firstName,
  lastName,
  email,
  password,
  department,
  section,
  year,
  role = "student",
) => {
  const [result] = await db.query(
    `INSERT INTO users (firstName, lastName, email, password, department, section, year, role)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [firstName, lastName, email, password, department, section, year, role],
  );
  return result;
};
