const db = require('../config/db');
const s3Service = require('./s3Service');

/**
 * Uploads a tenant image to S3 and updates the database
 * @param {string} tenantId - The ID of the tenant
 * @param {Buffer} imageBuffer - The image file buffer
 * @returns {Promise<Object>} Object containing the image URL and tenant details
 */
exports.uploadTenantImage = async (tenantId, imageBuffer) => {
  try {
    // Generate a unique filename
    const fileName = `tenant-${tenantId}-${Date.now()}.jpg`;
    
    // Upload to S3 and get the URL
    const imageUrl = await s3Service.uploadToS3(imageBuffer, fileName, 'tenant-images');
    
    // Update the tenant in the database with the new image URL
    const [result] = await db.query(
      'UPDATE mstenant SET gambar_tenant = ? WHERE id_tenant = ?',
      [imageUrl, tenantId]
    );
    
    if (result.affectedRows === 0) {
      throw new Error('Tenant not found');
    }
    
    // Get the updated tenant
    const [tenant] = await db.query(
      'SELECT * FROM mstenant WHERE id_tenant = ?',
      [tenantId]
    );
    
    return {
      success: true,
      message: 'Image uploaded successfully',
      data: {
        tenantId,
        imageUrl,
        tenant: tenant[0]
      }
    };
  } catch (error) {
    console.error('Error in uploadTenantImage:', error);
    throw new Error('Failed to upload tenant image');
  }
};

/**
 * Gets the image URL for a tenant
 * @param {string} tenantId - The ID of the tenant
 * @returns {Promise<string>} The image URL
 */
exports.getTenantImage = async (tenantId) => {
  try {
    const [tenant] = await db.query(
      'SELECT gambar_tenant FROM mstenant WHERE id_tenant = ?',
      [tenantId]
    );
    
    if (!tenant || tenant.length === 0) {
      throw new Error('Tenant not found');
    }
    
    return tenant[0].gambar_tenant;
  } catch (error) {
    console.error('Error in getTenantImage:', error);
    throw new Error('Failed to get tenant image');
  }
};