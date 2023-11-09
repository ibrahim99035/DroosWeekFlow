// database.js
const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'Week_Flow',
});

module.exports = db;