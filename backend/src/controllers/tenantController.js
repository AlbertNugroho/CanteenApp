const tenantService = require('../services/tenantService');

/**
 * Update tenant's slot capacity
 * @route PUT /api/tenants/slot-capacity
 * @access Private (Seller only)
 */
exports.updateSlotCapacity = async (req, res) => {
  try {
    const { slotPerTime } = req.body;
    const tenantId = req.user.id; // From auth middleware

    if (typeof slotPerTime !== 'number') {
      return res.status(400).json({
        success: false,
        message: 'Slot capacity must be a number'
      });
    }

    const updatedTenant = await tenantService.updateSlotCapacity(tenantId, slotPerTime);

    res.json({
      success: true,
      message: 'Slot capacity updated successfully',
      data: updatedTenant
    });
  } catch (error) {
    console.error('Error in updateSlotCapacity controller:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update slot capacity'
    });
  }
}; 