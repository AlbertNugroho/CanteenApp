const express = require('express');
const router = express.Router();
const multer = require('multer');
const imageService = require('../services/imageService');

// Configure multer for memory storage, as we are handling file buffers.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  },
});

/**
 * @route   POST /api/images/upload/:menuId
 * @desc    Upload an image for a specific menu item
 * @access  Private (should be protected by auth middleware in a real app)
 */
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

/**
 * @route   GET /api/images/:menuId
 * @desc    Get a temporary, pre-signed URL for a menu item's image
 * @access  Public
 */
router.get('/:menuId', async (req, res) => {
  try {
    const imageUrl = await imageService.getMenuImage(req.params.menuId);

    // If the service returns null, it means no image was found.
    if (!imageUrl) {
        return res.status(404).json({
            success: false,
            message: 'Image not found for this menu item.'
        });
    }

    // Return the freshly generated temporary URL.
    res.json({
      success: true,
      data: { imageUrl }
    });
  } catch (error) {
    console.error('Error in get menu image route:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve image URL.'
    });
  }
});

module.exports = router;
