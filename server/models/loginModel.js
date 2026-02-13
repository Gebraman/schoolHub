const db = require("../config/db");

exports.findUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, rows) => {
      if (err) return reject(err);
      resolve(rows[0]);
    });
  });
};
