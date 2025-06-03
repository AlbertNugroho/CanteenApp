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

// Import routes
const canteenRoutes = require('./routes/canteenRoutes');
const menuRoutes = require('./routes/menuRoutes');

// Routes
app.use('/api/canteens', canteenRoutes);
app.use('/api/menus', menuRoutes);

// Basic Route for testing
app.get('/', (req, res) => {
  res.send('Welcome to BINUS Canteen Backend API!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

module.exports = app;