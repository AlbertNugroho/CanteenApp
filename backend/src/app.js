// src/app.js
const express = require('express');
const cors = require('cors'); // You'll need to install this: npm install cors
const morgan = require('morgan'); // You'll need to install this: npm install morgan

const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(morgan('dev')); // HTTP request logger
app.use(express.json()); // Parses incoming requests with JSON payloads
app.use(express.urlencoded({ extended: true })); // Parses incoming requests with URL-encoded payloads

// Basic Route for testing
app.get('/', (req, res) => {
  res.send('Welcome to BINUS Canteen Backend API!');
});

// Placeholder for your API routes (you'll add these later)
// const apiRoutes = require('./routes/index');
// app.use('/api', apiRoutes);

// Basic error handling (you can expand this later)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;