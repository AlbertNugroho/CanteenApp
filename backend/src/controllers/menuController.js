const menuService = require('../services/menuService');

/**
 * Get all menus for a specific tenant
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getMenusByTenantId = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const menus = await menuService.getMenusByTenantId(tenantId);
    res.json({
      success: true,
      data: menus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch menus',
    });
  }
};

/**
 * Get all menus from all tenants
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAllMenus = async (req, res) => {
  try {
    const menus = await menuService.getAllMenus();
    res.json({
      success: true,
      data: menus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch all menus',
    });
  }
};

/**
 * Add a new menu item
 * @route POST /api/menus/add
 * @access Private (Seller only)
 */
exports.addMenu = async (req, res) => {
    try {
      const tenantId = req.user.id;
      const { name, description, price } = req.body;
  
      if (!name || !price) {
        return res.status(400).json({
          success: false,
          message: 'Menu name and price are required.',
        });
      }
  
      const newMenuItem = await menuService.addMenuItem(
        { name, description, price },
        tenantId
      );
  
      res.status(201).json({
        success: true,
        message: 'Menu item added successfully',
        data: newMenuItem,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to add menu item',
      });
    }
};

/**
 * Update menu item availability
 * @route PUT /api/menus/:menuId/availability
 * @access Private (Seller only)
 */
exports.updateMenuAvailability = async (req, res) => {
    try {
        const { menuId } = req.params;
        const { availability } = req.body;
        const tenantId = req.user.id; // from auth middleware

        if (availability === undefined || (availability !== 0 && availability !== 1)) {
            return res.status(400).json({
                success: false,
                message: 'Availability must be 0 or 1.'
            });
        }

        const result = await menuService.updateMenuAvailability(menuId, availability, tenantId);
        res.json({ success: true, data: result });

    } catch (error) {
        console.error('Error in updateMenuAvailability controller:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update menu availability'
        });
    }
};

/**
 * [NEW] Delete a menu item
 * @route DELETE /api/menus/:menuId
 * @access Private (Seller only)
 */
exports.deleteMenu = async (req, res) => {
  try {
    const { menuId } = req.params;
    const tenantId = req.user.id; // from auth middleware

    const result = await menuService.deleteMenuItem(menuId, tenantId);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error in deleteMenu controller:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete menu item'
    });
  }
};
