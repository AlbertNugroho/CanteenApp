const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
require('dotenv').config();

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN
  }
});

/**
 * Uploads a file to S3
 * @param {Buffer} fileBuffer - The file buffer to upload
 * @param {string} fileName - The name to give the file in S3
 * @param {string} folder - The folder to upload to (e.g., 'menu-images' or 'tenant-images')
 * @returns {Promise<string>} The S3 key of the uploaded file
 */
exports.uploadToS3 = async (fileBuffer, fileName, folder) => {
  try {
    // The key is the permanent identifier for the object in S3.
    const key = `${folder}/${fileName}`;
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: fileBuffer,
      ContentType: 'image/jpeg' // Adjust based on actual file type if needed
    });

    await s3Client.send(command);
    
    // IMPORTANT: Return the permanent key, NOT a temporary signed URL.
    return key;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw new Error('Failed to upload file to S3');
  }
};

/**
 * Gets a presigned URL for an S3 object
 * @param {string} key - The full key of the object in S3 (including folder)
 * @returns {Promise<string|null>} A presigned URL for the object, or null if key is missing or an error occurs.
 */
exports.getSignedUrl = async (key) => {
  // If no key is provided, we can't generate a URL.
  if (!key) {
    return null;
  }
  
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key
    });
    
    // Generate a fresh URL, valid for 1 hour. This should be done on-demand.
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return url;
  } catch (error) {
    console.error(`Error generating signed URL for key "${key}":`, error);
    // If the key doesn't exist in S3, a "NoSuchKey" error is thrown.
    // Returning null is a safe way to handle this.
    return null;
  }
};
