const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

// Get all menus from all tenants
router.get('/', menuController.getAllMenus);

// Get all menus for a specific tenant
router.get('/tenants/:tenantId', menuController.getMenusByTenantId);

module.exports = router; 