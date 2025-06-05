const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register routes
router.post('/register/:userType', authController.register);

// Login route
router.post('/login', authController.login);

module.exports = router; 