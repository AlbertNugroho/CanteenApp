const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { auth } = require('../middleware/auth');

// Get available timeslots for a tenant
router.get('/timeslots/:tenantId', orderController.getAvailableTimeslots);

// Create transaction from cart (requires authentication)
router.post('/checkout', auth, orderController.createTransaction);

// Get order details
router.get('/:transactionId', auth, orderController.getOrderDetails);

// Update order status
router.put('/:transactionId/status', auth, orderController.updateOrderStatus);

module.exports = router; 