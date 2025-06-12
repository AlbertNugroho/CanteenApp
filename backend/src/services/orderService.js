const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

/**
 * Get available timeslots for a tenant
 * @param {string} tenantId - The tenant's ID
 * @param {string} date - The date to check timeslots for (YYYY-MM-DD)
 * @returns {Promise<Array>} Array of timeslot objects with availability
 */
exports.getAvailableTimeslots = async (tenantId, date) => {
  try {
    // Get tenant's slot capacity
    const [tenant] = await db.query(
      'SELECT slot_per_time FROM mstenant WHERE id_tenant = ?',
      [tenantId]
    );

    if (tenant.length === 0) {
      throw new Error('Tenant not found');
    }

    const slotCapacity = tenant[0].slot_per_time;

    // Get booked orders for each timeslot
    const [bookedSlots] = await db.query(
      `SELECT timeslot, COUNT(*) as booked
       FROM transaksi 
       WHERE id_tenant = ? AND DATE(transaction_date) = ?
       GROUP BY timeslot`,
      [tenantId, date]
    );

    // Define fixed timeslots
    const fixedTimeslots = [
      { time: '09:00', endTime: '09:20' },
      { time: '11:00', endTime: '11:20' },
      { time: '13:00', endTime: '13:20' },
      { time: '15:00', endTime: '15:20' },
      { time: '17:00', endTime: '17:20' }
    ];

    // Calculate availability for each timeslot
    return fixedTimeslots.map(slot => {
      const booked = bookedSlots.find(b => b.timeslot === slot.time)?.booked || 0;
      return {
        ...slot,
        available: slotCapacity - booked,
        total: slotCapacity
      };
    });
  } catch (error) {
    console.error('Error in getTimeslots service:', error);
    throw error;
  }
};

/**
 * Process checkout from cart
 * @param {string} userId - The user's ID
 * @param {string} tenantId - The tenant's ID
 * @param {string} timeslot - Selected timeslot
 * @returns {Promise<Object>} Order details
 */
exports.checkout = async (userId, tenantId, timeslot) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    // Get cart items
    const [cartItems] = await db.query(
      `SELECT 
        dc.id_menu,
        m.nama_menu,
        m.harga_menu,
        dc.quantity
      FROM cart c
      JOIN detail_cart dc ON c.id_cart = dc.id_cart
      JOIN menu m ON dc.id_menu = m.id_menu
      WHERE c.id_user = ? AND c.id_tenant = ?
      GROUP BY dc.id_menu`,
      [userId, tenantId]
    );

    if (cartItems.length === 0) {
      throw new Error('Cart is empty');
    }

    // Calculate total amount
    const totalAmount = cartItems.reduce((sum, item) => {
      const basePrice = item.harga_menu * item.quantity;
      return sum + basePrice;
    }, 0);

    // Generate transaction ID
    const transactionId = uuidv4();

    // Create transaction header
    await connection.query(
      `INSERT INTO transaksi (
        id_transaksi, 
        id_user, 
        id_tenant, 
        tanggal,
        timeslot,
        total_amount, 
        status
      ) VALUES (?, ?, ?, NOW(), ?, ?, 'pending')`,
      [transactionId, userId, tenantId, timeslot, totalAmount]
    );

    // Create transaction details
    for (const item of cartItems) {
      const itemNo = uuidv4();
      const baseSubtotal = item.harga_menu * item.quantity;

      // Insert main item
      await connection.query(
        `INSERT INTO detail_transaksi (
          item_no,
          id_transaksi,
          id_menu,
          quantity,
          subtotal
        ) VALUES (?, ?, ?, ?, ?)`,
        [itemNo, transactionId, item.id_menu, item.quantity, baseSubtotal]
      );
    }

    // Delete cart and its items
    await connection.query(
      'DELETE FROM cart WHERE id_user = ? AND id_tenant = ?',
      [userId, tenantId]
    );

    await connection.commit();

    return {
      transactionId,
      totalAmount
    };
  } catch (error) {
    await connection.rollback();
    console.error('Error in checkout service:', error);
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Get order details
 * @param {string} transactionId - The transaction ID
 * @returns {Promise<Object>} Transaction details with items
 */
exports.getOrderDetails = async (transactionId) => {
  try {
    // Get transaction header
    const [transactions] = await db.query(
      `SELECT 
        t.id_transaksi,
        t.tanggal,
        t.timeslot,
        t.total_amount,
        t.status,
        u.nama as customer_name,
        mt.nama_tenant
      FROM transaksi t
      JOIN msuser u ON t.id_user = u.id_user
      JOIN mstenant mt ON t.id_tenant = mt.id_tenant
      WHERE t.id_transaksi = ?`,
      [transactionId]
    );

    if (transactions.length === 0) {
      throw new Error('Transaction not found');
    }

    // Get order items
    const [items] = await db.query(
      `SELECT 
        dt.item_no,
        m.nama_menu,
        dt.quantity,
        dt.subtotal
      FROM detail_transaksi dt
      JOIN menu m ON dt.id_menu = m.id_menu
      WHERE dt.id_transaksi = ?
      GROUP BY dt.item_no`,
      [transactionId]
    );

    return {
      ...transactions[0],
      items
    };
  } catch (error) {
    console.error('Error in getOrderDetails service:', error);
    throw error;
  }
}; 