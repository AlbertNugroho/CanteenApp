const menuService = require('../services/menuService');

/**
 * Get all menus for a specific tenant
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getMenusByTenantId = async (req, res) => {
  try {
    const { tenantId } = req.params;
    console.log('Fetching menus for tenant:', tenantId);
    const menus = await menuService.getMenusByTenantId(tenantId);
    res.json({
      success: true,
      data: menus
    });
  } catch (error) {
    console.error('Error in getMenusByTenantId controller:', {
      message: error.message,
      code: error.code,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
    res.status(500).json({
      success: false,
      message: error.sqlMessage || error.message || 'Failed to fetch menus',
      error: process.env.NODE_ENV === 'development' ? {
        code: error.code,
        sqlState: error.sqlState
      } : undefined
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
    console.error('Error in getAllMenus controller:', {
      message: error.message,
      code: error.code,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
    res.status(500).json({
      success: false,
      message: error.sqlMessage || error.message || 'Failed to fetch all menus',
      error: process.env.NODE_ENV === 'development' ? {
        code: error.code,
        sqlState: error.sqlState
      } : undefined
    });
  }
}; 