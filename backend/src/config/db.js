// src/config/db.js
const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,
  charset: 'utf8mb4', // Keep this
  collation: 'utf8mb4_0900_ai_ci' // <<< ADD THIS LINE to match your DB tables
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    console.error('!!! DATABASE CONNECTION FAILED !!!');
    console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    console.error('Error connecting to database:', err.message);
    process.exit(1);
    return;
  }
  if (connection) {
    // You might not even need the explicit SET NAMES query anymore
    // if the pool is configured with the correct charset and collation.
    // For testing, you can remove it. If issues persist, you can add it back
    // ensuring it matches the pool's collation.
    console.log('Attempting to verify connection settings (collation will be based on pool config)...');
    connection.release();
    console.log('✅ Successfully connected to the MySQL database via pool. Collation set via pool config.');
  }
});

module.exports = pool.promise();