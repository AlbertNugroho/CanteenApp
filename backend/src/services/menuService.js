const db = require('../config/db');

/**
 * Get all menu items for a specific tenant
 * @param {string} tenantId - The tenant's ID
 * @returns {Promise<Array>} Array of menu items
 */
exports.getMenusByTenantId = async (tenantId) => {
  try {
    const [menuItems] = await db.query(
      `SELECT 
        id_menu,
        nama_menu,
        harga_menu,
        gambar_menu,
        availability,
        id_tenant
      FROM menu 
      WHERE id_tenant = ?`,
      [tenantId]
    );
    return menuItems;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all menus from all tenants
 * @returns {Promise<Array>} Array of all menu items
 */
exports.getAllMenus = async () => {
  try {
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
    throw error;
  }
};

/**
 * Get a specific menu item by ID
 * @param {string} menuId - The menu item's ID
 * @returns {Promise<Object>} Menu item details
 */
exports.getMenuById = async (menuId) => {
  try {
    const [menuItems] = await db.query(
      `SELECT 
        id_menu,
        nama_menu,
        deskripsi,
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
    throw error;
  }
};

/**
 * Add a new menu item for a specific tenant
 * @param {Object} menuData - Contains name, description, price
 * @param {string} tenantId - The tenant's ID
 * @returns {Promise<Object>} The newly created menu item
 */
exports.addMenuItem = async (menuData, tenantId) => {
    const { name, description, price } = menuData;
    const [result] = await db.query(
      'INSERT INTO menu (nama_menu, deskripsi, harga_menu, id_tenant, availability) VALUES (?, ?, ?, ?, 1)',
      [name, description, price, tenantId]
    );
    if (result.affectedRows === 0) {
      throw new Error('Failed to add menu item');
    }
    const [newMenu] = await db.query(
      'SELECT * FROM menu WHERE id_tenant = ? AND nama_menu = ? ORDER BY id_menu DESC LIMIT 1',
      [tenantId, name]
    );
    return newMenu[0];
};

/**
 * Update a menu item's availability
 * @param {string} menuId - The ID of the menu item to update
 * @param {number} availability - The new availability status (1 for available, 0 for not)
 * @param {string} tenantId - The ID of the tenant making the request (for authorization)
 * @returns {Promise<Object>} The result of the update operation
 */
exports.updateMenuAvailability = async (menuId, availability, tenantId) => {
    const [result] = await db.query(
        'UPDATE menu SET availability = ? WHERE id_menu = ? AND id_tenant = ?',
        [availability, menuId, tenantId]
    );

    if (result.affectedRows === 0) {
        throw new Error('Menu item not found or you do not have permission to update it.');
    }

    return { message: 'Availability updated successfully.' };
};

/**
 * [NEW] Delete a menu item
 * @param {string} menuId - The ID of the menu item to delete
 * @param {string} tenantId - The ID of the tenant making the request (for authorization)
 * @returns {Promise<Object>} The result of the delete operation
 */
exports.deleteMenuItem = async (menuId, tenantId) => {
  // First, we must delete referencing rows in child tables (detail_cart, detail_transaksi).
  // This is important to avoid foreign key constraint errors.
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // Check if the menu item belongs to the tenant making the request
    const [menu] = await connection.query(
      'SELECT id_tenant FROM menu WHERE id_menu = ?',
      [menuId]
    );
    if (menu.length === 0 || menu[0].id_tenant !== tenantId) {
      throw new Error('Menu item not found or you do not have permission to delete it.');
    }

    // Delete from child tables first
    await connection.query('DELETE FROM detail_cart WHERE id_menu = ?', [menuId]);
    await connection.query('DELETE FROM detail_transaksi WHERE id_menu = ?', [menuId]);

    // Finally, delete the menu item itself
    const [result] = await connection.query(
      'DELETE FROM menu WHERE id_menu = ? AND id_tenant = ?',
      [menuId, tenantId]
    );
    
    await connection.commit();
    
    if (result.affectedRows === 0) {
      // This case should ideally not be hit due to the check above, but it's good practice.
      throw new Error('Menu item not found or you do not have permission to delete it.');
    }

    return { message: 'Menu item deleted successfully.' };
  } catch (error) {
    await connection.rollback();
    console.error('Error in deleteMenuItem service:', error);
    throw error;
  } finally {
    connection.release();
  }
};
