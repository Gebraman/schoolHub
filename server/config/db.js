// server/config/db.js
require("dotenv").config();
const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

// Path to CA certificate
const caPath = path.join(__dirname, "ca.pem");

// Check if we're in production (Render)
const isProduction =
  process.env.NODE_ENV === "production" || process.env.RENDER === "true";

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "schoolhub",
  password: process.env.DB_PASS || "Gebremedhin100%",
  database: process.env.DB_NAME || "schoolhub_db",
  port: process.env.DB_PORT || 3306,
  timezone: "Z",
  waitForConnections: true,
  // Enable SSL for TiDB Cloud
  ssl: isProduction
    ? {
        ca: fs.existsSync(caPath) ? fs.readFileSync(caPath) : undefined,
        rejectUnauthorized: true,
      }
    : null,
});

module.exports = db;
