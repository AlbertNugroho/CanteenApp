const mysql = require('mysql2');
require('dotenv').config(); // Load environment variables from .env

// Create a connection pool using environment variables
const pool = mysql.createPool({
    host: process.env.DB_HOST, // AWS RDS Endpoint
    user: process.env.DB_USER, // Database username
    password: process.env.DB_PASSWORD, // Database password
    database: process.env.DB_NAME, // Database name
    port: process.env.DB_PORT || 3306, // Database port (Default is 3306)
    waitForConnections: true, // Wait for connections if all are in use
    connectionLimit: 10, //Max number of connections in pool
    queueLimit: 0, //Max number of connection request to queue (0 = n0 limit)
    connectTimeout: 10000 //connection timeout(10 seconds)
});

// Test the pool on creation (or handle in server.js for startup check)
pool.getConnection((err, connection) => {
  if (err) {
    console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    console.error('!!! DATABASE CONNECTION FAILED !!!');
    console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    console.error('Error connecting to database:', err.message);
    console.error('Please check your .env file and AWS RDS settings.');
    // In a real app, you might want to handle this more gracefully,
    // but exiting during startup for a failed DB connection is common.
    // Consider adding retry logic or better health checks later.
    process.exit(1); // Exit if connection fails on initial check
    return;
  }
  if (connection) {
    connection.release(); // IMPORTANT: Release the connection back to the pool
    console.log('✅ Successfully connected to the MySQL database via pool.');
  }
});

// Export the pool with promise support, making it easier to use with async/await
module.exports = pool.promise();