const db = require('../config/db');

/**
 * Update tenant's slot capacity per timeslot
 * @param {string} tenantId - The tenant's ID
 * @param {number} slotPerTime - Number of orders that can be handled per timeslot
 * @returns {Promise<Object>} Updated tenant data
 */
exports.updateSlotCapacity = async (tenantId, slotPerTime) => {
  try {
    // Validate input
    if (slotPerTime < 0) {
      throw new Error('Slot capacity cannot be negative');
    }

    const [result] = await db.query(
      'UPDATE mstenant SET slot_per_time = ? WHERE id_tenant = ?',
      [slotPerTime, tenantId]
    );

    if (result.affectedRows === 0) {
      throw new Error('Tenant not found');
    }

    // Get updated tenant data
    const [tenant] = await db.query(
      'SELECT id_tenant, nama_tenant, slot_per_time FROM mstenant WHERE id_tenant = ?',
      [tenantId]
    );

    return tenant[0];
  } catch (error) {
    console.error('Error in updateSlotCapacity:', error);
    throw error;
  }
};
