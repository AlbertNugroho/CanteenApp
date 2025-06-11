const db = require('../config/db');

/**
 * Get all menu items for a specific tenant
 * @param {string} tenantId - The tenant's ID
 * @returns {Promise<Array>} Array of menu items
 */
exports.getMenusByTenantId = async (tenantId) => {
  try {
    // Get menu items
    const [menuItems] = await db.query(
      `SELECT 
        id_menu,
        nama_menu,
        harga_menu,
        gambar_menu,
        IF(availability = 1, 'Available', 'Out of Stock') as availability,
        id_tenant
      FROM menu 
      WHERE id_tenant = ?`,
      [tenantId]
    );

    console.log('Menu items found:', menuItems.length);
    return menuItems;
  } catch (error) {
    console.error('Detailed error in getMenusByTenantId service:', {
      message: error.message,
      code: error.code,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
    throw error; // Throw the original error to preserve details
  }
};

/**
 * Get all menus from all tenants
 * @returns {Promise<Array>} Array of all menu items
 */
exports.getAllMenus = async () => {
  try {
    // Get all menu items
    const [menuItems] = await db.query(
      `SELECT 
        m.id_menu,
        m.nama_menu,
        m.harga_menu,
        m.gambar_menu,
        IF(m.availability = 1, 'Available', 'Out of Stock') as availability,
        m.id_tenant,
        t.nama_tenant
      FROM menu m
      JOIN mstenant t ON m.id_tenant = t.id_tenant`
    );

    return menuItems;
  } catch (error) {
    console.error('Detailed error in getAllMenus service:', {
      message: error.message,
      code: error.code,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
    throw error; // Throw the original error to preserve details
  }
};

/**
 * Get a specific menu item by ID
 * @param {string} menuId - The menu item's ID
 * @returns {Promise<Object>} Menu item details
 */
exports.getMenuById = async (menuId) => {
  try {
    // Get menu item
    const [menuItems] = await db.query(
      `SELECT 
        id_menu,
        nama_menu,
        deskripsi_menu,
        harga_menu,
        gambar_menu,
        availability,
        id_tenant
      FROM menu 
      WHERE id_menu = ?`,
      [menuId]
    );

    if (menuItems.length === 0) {
      throw new Error('Menu item not found');
    }

    return menuItems[0];
  } catch (error) {
    console.error('Error in getMenuById service:', error);
    throw error;
  }
}; 