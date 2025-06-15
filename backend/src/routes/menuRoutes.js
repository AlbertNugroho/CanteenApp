const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { auth, sellerAuth } = require('../middleware/auth');

// Get all menus from all tenants
router.get('/', menuController.getAllMenus);

// Get all menus for a specific tenant
router.get('/tenants/:tenantId', menuController.getMenusByTenantId);

// Add a new menu item for the logged-in seller
router.post('/add', auth, sellerAuth, menuController.addMenu);

// Update a menu item's availability
router.put('/:menuId/availability', auth, sellerAuth, menuController.updateMenuAvailability);

// [NEW] Delete a menu item
router.delete('/:menuId', auth, sellerAuth, menuController.deleteMenu);

module.exports = router;
