const express = require('express');
const router = express.Router();
const multer = require('multer');
const tenantImageService = require('../services/tenantImageService');

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

/**
 * @route   POST /api/tenant-images/upload/:tenantId
 * @desc    Upload an image for a specific tenant
 * @access  Private (should be auth protected)
 */
router.post('/upload/:tenantId', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    const result = await tenantImageService.uploadTenantImage(
      req.params.tenantId,
      req.file.buffer
    );

    res.json(result);
  } catch (error) {
    console.error('Error in upload tenant image route:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload tenant image'
    });
  }
});

/**
 * @route   GET /api/tenant-images/:tenantId
 * @desc    Get a temporary URL for a tenant's image
 * @access  Public
 */
router.get('/:tenantId', async (req, res) => {
  try {
    const imageUrl = await tenantImageService.getTenantImage(req.params.tenantId);
    
    if (!imageUrl) {
        return res.status(404).json({
            success: false,
            message: 'Tenant image not found.'
        });
    }

    res.json({
      success: true,
      data: { imageUrl }
    });
  } catch (error) {
    console.error('Error in get tenant image route:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get tenant image'
    });
  }
});

module.exports = router;
