const express = require('express');
const router = express.Router();
const canteenController = require('../controllers/canteenController');

// GET /api/canteens - Fetch all canteens
router.get('/', canteenController.getAllCanteens);

// You can add other canteen-related routes here later, like GET /api/canteens/:id for a specific canteen

module.exports = router;