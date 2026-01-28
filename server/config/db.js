const express = require("express");
const app = express();
//connect to the database
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "schoolhub",
  password: "Gebremedhin100%",
  database: "schoolhub"
});

db.connect(err => {
  if (err) {
    console.error("❌ MySQL error:", err);
  } else {
    console.log("✅ MySQL connected");
  }
});

module.exports = db;

