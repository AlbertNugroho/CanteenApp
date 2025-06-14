const db = require('../config/db');
const s3Service = require('./s3Service');

/**
 * Uploads a menu image to S3 and updates the database with the permanent S3 key.
 * @param {string} menuId - The ID of the menu item
 * @param {Buffer} imageBuffer - The image file buffer
 * @returns {Promise<Object>} Object containing the S3 key and menu details
 */
exports.uploadMenuImage = async (menuId, imageBuffer) => {
  try {
    // 1. Generate a unique filename that will be used as the S3 key.
    const fileName = `menu-${menuId}-${Date.now()}.jpg`;
    
    // 2. Upload to S3 and get the permanent S3 key back.
    const s3Key = await s3Service.uploadToS3(imageBuffer, fileName, 'menu-images');
    
    // 3. Update the menu item in the database with the new S3 key.
    const [result] = await db.query(
      'UPDATE menu SET gambar_menu = ? WHERE id_menu = ?',
      [s3Key, menuId]
    );
    
    // If no rows are affected, it means the menuId was not found.
    if (result.affectedRows === 0) {
      throw new Error('Menu item not found');
    }
    
    // 4. Get the updated menu item to confirm the change.
    const [menu] = await db.query(
      'SELECT * FROM menu WHERE id_menu = ?',
      [menuId]
    );
    
    return {
      success: true,
      message: 'Image uploaded successfully and key stored.',
      data: {
        menuId,
        s3Key, // Return the permanent key for reference.
        menu: menu[0]
      }
    };
  } catch (error) {
    console.error('Error in uploadMenuImage:', error);
    // Re-throw the original, more specific error to the route handler.
    throw error;
  }
};

/**
 * Gets a fresh, temporary image URL for a menu item.
 * @param {string} menuId - The ID of the menu item
 * @returns {Promise<string|null>} The image URL, or null if not found.
 */
exports.getMenuImage = async (menuId) => {
  try {
    // 1. Get the S3 key from the database.
    const [menu] = await db.query(
      'SELECT gambar_menu FROM menu WHERE id_menu = ?',
      [menuId]
    );
    
    // Check if the menu item exists and has an image key.
    if (!menu || menu.length === 0 || !menu[0].gambar_menu) {
      console.warn(`Image key not found for menu item ID: ${menuId}`);
      return null; // Return null to indicate no image is available.
    }
    
    const s3Key = menu[0].gambar_menu;
    
    // 2. Generate a new signed URL from the stored key.
    const signedUrl = await s3Service.getSignedUrl(s3Key);
    
    return signedUrl;

  } catch (error) {
    console.error('Error in getMenuImage:', error);
    // Re-throw the original error to be handled by the controller.
    throw error;
  }
};
