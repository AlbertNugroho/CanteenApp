const express = require('express');
const router = express.Router();

// Import your route modules
// const authRoutes = require('./authRoutes'); // If you have authentication routes
const canteenRoutes = require('./canteenRoutes'); // Your new canteen routes
// const orderRoutes = require('./orderRoutes'); // If you have order routes

// Health Check Endpoint (example)
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    message: 'API is healthy and running',
    timestamp: new Date().toISOString()
  });
});

// Mount your routes
// router.use('/auth', authRoutes);
router.use('/canteens', canteenRoutes); // This makes /api/canteens available
// router.use('/orders', orderRoutes);

module.exports = router;