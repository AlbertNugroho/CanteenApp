const db = require('../config/db');
const s3Service = require('./s3Service');

/**
 * Uploads a tenant image to S3 and updates the database with the permanent S3 key.
 * @param {string} tenantId - The ID of the tenant
 * @param {Buffer} imageBuffer - The image file buffer
 * @returns {Promise<Object>} Object containing the S3 key and tenant details
 */
exports.uploadTenantImage = async (tenantId, imageBuffer) => {
  try {
    // 1. Generate a unique filename that will be used as the S3 key.
    const fileName = `tenant-${tenantId}-${Date.now()}.jpg`;
    
    // 2. Upload to S3 and get the permanent S3 key back.
    const s3Key = await s3Service.uploadToS3(imageBuffer, fileName, 'tenant-images');
    
    // 3. Update the tenant in the database with the new S3 key.
    const [result] = await db.query(
      'UPDATE mstenant SET gambar_tenant = ? WHERE id_tenant = ?',
      [s3Key, tenantId]
    );
    
    // If no rows are affected, it means the tenantId was not found.
    if (result.affectedRows === 0) {
      throw new Error('Tenant not found');
    }
    
    // 4. Get the updated tenant to confirm the change.
    const [tenant] = await db.query(
      'SELECT * FROM mstenant WHERE id_tenant = ?',
      [tenantId]
    );
    
    return {
      success: true,
      message: 'Tenant image uploaded successfully and key stored.',
      data: {
        tenantId,
        s3Key, // Return the permanent key for reference.
        tenant: tenant[0]
      }
    };
  } catch (error) {
    console.error('Error in uploadTenantImage:', error);
    // Re-throw the original, more specific error.
    throw error;
  }
};

/**
 * Gets a fresh, temporary image URL for a tenant.
 * @param {string} tenantId - The ID of the tenant
 * @returns {Promise<string|null>} The image URL, or null if not found.
 */
exports.getTenantImage = async (tenantId) => {
  try {
    // 1. Get the S3 key from the database.
    const [tenant] = await db.query(
      'SELECT gambar_tenant FROM mstenant WHERE id_tenant = ?',
      [tenantId]
    );
    
    // Check if the tenant exists and has an image key.
    if (!tenant || tenant.length === 0 || !tenant[0].gambar_tenant) {
      console.warn(`Image key not found for tenant ID: ${tenantId}`);
      return null;
    }
    
    const s3Key = tenant[0].gambar_tenant;
    
    // 2. Generate a new signed URL from the stored key.
    const signedUrl = await s3Service.getSignedUrl(s3Key);
    
    return signedUrl;

  } catch (error) {
    console.error('Error in getTenantImage:', error);
    throw new Error('Failed to get tenant image');
  }
};
