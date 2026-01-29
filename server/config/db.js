require("dotenv").config();
// connect to the database using environment variables
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "schoolhub",
  password: process.env.DB_PASS || "Gebremedhin100%",
  database: process.env.DB_NAME || "schoolhub",
  waitForConnections: true,
});

db.connect((err) => {
  if (err) {
    console.error(" MySQL error:", err);
  } else {
    console.log(" MySQL connected");
  }
});

module.exports = db;
