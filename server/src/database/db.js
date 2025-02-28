const mysql = require("mysql2");
const options = require("../configs/database_config.js");

const db = mysql.createConnection(options);

db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Database connected");
  }
});

module.exports = db;
