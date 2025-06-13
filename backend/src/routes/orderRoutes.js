const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { auth, sellerAuth, customerAuth } = require('../middleware/auth');

// Get available timeslots for a tenant
router.get('/timeslots/:tenantId', orderController.getAvailableTimeslots);

// Create transaction from cart (requires authentication)
router.post('/checkout', auth, orderController.createTransaction);

// Get all orders for the logged-in tenant
router.get('/tenant/all', auth, sellerAuth, orderController.getOrdersByTenant);

// Get all orders for the logged-in customer
router.get('/my-orders', auth, customerAuth, orderController.getOrdersByUser);

// Get order details
router.get('/:transactionId', auth, orderController.getOrderDetails);

// Update order status
router.put('/:transactionId/status', auth, orderController.updateOrderStatus);

module.exports = router;
