const db = require('../config/db');
const s3Service = require('./s3Service');

/**
 * Save image key to database
 * @param {string} s3Key - The S3 key of the uploaded image
 * @param {string} menuId - The ID of the menu item
 * @returns {Promise<void>}
 */
exports.saveImageKey = async (s3Key, menuId) => {
  try {
    await db.query(
      'UPDATE menu SET gambar_menu = ? WHERE id_menu = ?',
      [s3Key, menuId]
    );
  } catch (error) {
    console.error('Error saving image key:', error);
    throw new Error('Failed to save image key to database');
  }
};

/**
 * Get image key from database
 * @param {string} menuId - The ID of the menu item
 * @returns {Promise<string|null>} The S3 key of the image
 */
exports.getImageKey = async (menuId) => {
  try {
    const [rows] = await db.query(
      'SELECT gambar_menu FROM menu WHERE id_menu = ?',
      [menuId]
    );
    return rows[0]?.gambar_menu || null;
  } catch (error) {
    console.error('Error getting image key:', error);
    throw new Error('Failed to get image key from database');
  }
};

/**
 * Uploads a menu image to S3 and updates the database
 * @param {string} menuId - The ID of the menu item
 * @param {Buffer} imageBuffer - The image file buffer
 * @returns {Promise<Object>} Object containing the image URL and menu details
 */
exports.uploadMenuImage = async (menuId, imageBuffer) => {
  try {
    // Generate a unique filename
    const fileName = `menu-${menuId}-${Date.now()}.jpg`;
    
    // Upload to S3 and get the URL
    const imageUrl = await s3Service.uploadToS3(imageBuffer, fileName, 'menu-images');
    
    // Update the menu item in the database with the new image URL
    const [result] = await db.query(
      'UPDATE menu SET gambar_menu = ? WHERE CONCAT(id_tenant, "-", LPAD(SUBSTRING_INDEX(id_menu, "-", -1), 3, "0")) = ?',
      [imageUrl, menuId]
    );
    
    if (result.affectedRows === 0) {
      throw new Error('Menu item not found');
    }
    
    // Get the updated menu item
    const [menu] = await db.query(
      'SELECT * FROM menu WHERE CONCAT(id_tenant, "-", LPAD(SUBSTRING_INDEX(id_menu, "-", -1), 3, "0")) = ?',
      [menuId]
    );
    
    return {
      success: true,
      message: 'Image uploaded successfully',
      data: {
        menuId,
        imageUrl,
        menu: menu[0]
      }
    };
  } catch (error) {
    console.error('Error in uploadMenuImage:', error);
    throw new Error('Failed to upload menu image');
  }
};

/**
 * Gets the image URL for a menu item
 * @param {string} menuId - The ID of the menu item
 * @returns {Promise<string>} The image URL
 */
exports.getMenuImage = async (menuId) => {
  try {
    const [menu] = await db.query(
      'SELECT gambar_menu FROM menu WHERE CONCAT(id_tenant, "-", LPAD(SUBSTRING_INDEX(id_menu, "-", -1), 3, "0")) = ?',
      [menuId]
    );
    
    if (!menu || menu.length === 0) {
      throw new Error('Menu item not found');
    }
    
    return menu[0].gambar_menu;
  } catch (error) {
    console.error('Error in getMenuImage:', error);
    throw new Error('Failed to get menu image');
  }
};