require("dotenv").config();
const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

// Path to CA certificate (Render mounts secret files at /etc/secrets/)
const caPath = "./ca.pem";

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "schoolhub",
  password: process.env.DB_PASS || "Gebremedhin100%",
  database: process.env.DB_NAME || "schoolhub_db",
  port: process.env.DB_PORT || 3306,
  timezone: "Z",
  waitForConnections: true,
  ssl:
    process.env.DB_SSL === "true"
      ? {
          ca: fs.existsSync(caPath) ? fs.readFileSync(caPath) : undefined,
          rejectUnauthorized: true,
        }
      : null,
});

module.exports = db;
