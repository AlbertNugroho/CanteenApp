const db = require('../config/db');

/**
 * Fetches all menus for a specific tenant
 * @param {string} tenantId - The ID of the tenant
 * @returns {Promise<Array>} Array of menu items
 */
exports.getMenusByTenantId = async (tenantId) => {
  try {
    const [rows] = await db.query(
      `SELECT 
        CONCAT(id_tenant, '-', LPAD(SUBSTRING_INDEX(id_menu, '-', -1), 3, '0')) as id_menu,
        nama_menu,
        harga_menu,
        gambar_menu,
        deskripsi,
        availability,
        id_tenant
      FROM menu
      WHERE id_tenant = ?`,
      [tenantId]
    );
    return rows;
  } catch (error) {
    console.error('Error in getMenusByTenantId service:', error);
    throw new Error('Failed to fetch menus for tenant');
  }
};

/**
 * Fetches all menus from all tenants
 * @returns {Promise<Array>} Array of all menu items
 */
exports.getAllMenus = async () => {
  try {
    const [rows] = await db.query(
      `SELECT 
        CONCAT(id_tenant, '-', LPAD(SUBSTRING_INDEX(id_menu, '-', -1), 3, '0')) as id_menu,
        nama_menu,
        harga_menu,
        gambar_menu,
        deskripsi,
        availability,
        id_tenant
      FROM menu`
    );
    return rows;
  } catch (error) {
    console.error('Error in getAllMenus service:', error);
    throw new Error('Failed to fetch all menus');
  }
}; 