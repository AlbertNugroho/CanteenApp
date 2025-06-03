const express = require('express');
const router = express.Router();
const multer = require('multer');
const s3Service = require('../services/s3Service');
const imageService = require('../services/imageService');

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Debug middleware
router.use((req, res, next) => {
  console.log('Image route accessed:', req.method, req.path);
  next();
});

// Upload image for a menu item
router.post('/upload/:menuId', upload.single('image'), async (req, res) => {
  console.log('Upload endpoint hit', { menuId: req.params.menuId, file: !!req.file });
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const { menuId } = req.params;
    const { buffer, mimetype } = req.file;

    // Upload to S3
    const s3Key = await s3Service.uploadToS3(buffer, mimetype);

    // Save S3 key to database
    await imageService.saveImageKey(s3Key, menuId);

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      key: s3Key
    });
  } catch (error) {
    console.error('Error in image upload:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload image'
    });
  }
});

// Get image URL for a menu item
router.get('/:menuId', async (req, res) => {
  console.log('Get image endpoint hit', { menuId: req.params.menuId });
  try {
    const { menuId } = req.params;

    // Get S3 key from database
    const s3Key = await imageService.getImageKey(menuId);

    if (!s3Key) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    // Generate signed URL
    const url = await s3Service.getSignedUrl(s3Key);

    res.json({
      success: true,
      url
    });
  } catch (error) {
    console.error('Error getting image URL:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get image URL'
    });
  }
});

// Upload menu image
router.post('/upload/:menuId', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    const result = await imageService.uploadMenuImage(
      req.params.menuId,
      req.file.buffer
    );

    res.json(result);
  } catch (error) {
    console.error('Error in upload menu image route:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload menu image'
    });
  }
});

// Get menu image
router.get('/:menuId', async (req, res) => {
  try {
    const imageUrl = await imageService.getMenuImage(req.params.menuId);
    res.json({
      success: true,
      data: { imageUrl }
    });
  } catch (error) {
    console.error('Error in get menu image route:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get menu image'
    });
  }
});

module.exports = router;