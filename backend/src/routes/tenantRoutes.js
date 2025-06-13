const express = require('express');
const router = express.Router();
const tenantController = require('../controllers/tenantController');
const { auth, sellerAuth } = require('../middleware/auth');

// Update slot capacity (seller only)
router.put('/slot-capacity', auth, sellerAuth, tenantController.updateSlotCapacity);

module.exports = router;
