const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { auth } = require('../middleware/auth');

// Get cart items for the authenticated user
router.get('/', auth, cartController.getCart);

// Add item to cart
router.post('/add', auth, cartController.addToCart);

// Update cart item quantity
router.put('/update', auth, cartController.updateCartItem);

// Delete item from cart
router.delete('/delete/:menuId', auth, cartController.deleteCartItem);

module.exports = router; 