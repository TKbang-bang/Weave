const mysql = require("mysql2");
const options = require("../configs/database_config.js");

const conn = mysql.createConnection(options);

conn.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Database connected");
  }
});

const db = conn.promise();

module.exports = db;
