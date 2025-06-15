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
       WHERE id_tenant = ? AND DATE(transaction_date) = ? AND status != 'Cancelled '
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
        available: Math.max(0, slotCapacity - booked),
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

        // Step 1: Get the user's cart for the specific tenant
        const [cart] = await connection.query(
            'SELECT id_cart FROM cart WHERE id_user = ? AND id_tenant = ?',
            [userId, tenantId]
        );

        if (cart.length === 0) {
            throw new Error('Cart for this tenant is empty or not found.');
        }
        const cartId = cart[0].id_cart;

        // Step 2: Get all items from that cart
        const [cartItems] = await connection.query(
            `SELECT
                dc.id_menu,
                m.nama_menu,
                m.harga_menu,
                dc.quantity
            FROM detail_cart dc
            JOIN menu m ON dc.id_menu = m.id_menu
            WHERE dc.id_cart = ?`,
            [cartId]
        );

        if (cartItems.length === 0) {
            throw new Error('No items in the cart to checkout.');
        }

        // Step 3: Calculate total amount
        const totalAmount = cartItems.reduce((sum, item) => {
            return sum + (item.harga_menu * item.quantity);
        }, 0);

        // Step 4: Create the main transaction record
        const transactionDate = new Date();
        const status = 'Pending ';
        const formattedTimeslot = `${timeslot}:00`;
        
        await connection.query(
            `INSERT INTO transaksi (id_user, id_tenant, transaction_date, timeslot, total_amount, status)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [userId, tenantId, transactionDate, formattedTimeslot, totalAmount, status]
        );

        // **THE FIX**: Instead of ordering by a potentially non-unique date,
        // we find the HIGHEST transaction ID for that user/tenant.
        // This assumes the trigger generates sequentially increasing IDs (e.g., T001, T002 or ...CEP, ...CEQ).
        const [newTransaction] = await connection.query(
            'SELECT MAX(id_transaksi) as id_transaksi FROM transaksi WHERE id_user = ? AND id_tenant = ?',
            [userId, tenantId]
        );

        if (!newTransaction || newTransaction.length === 0 || !newTransaction[0].id_transaksi) {
            throw new Error('Failed to create or retrieve transaction ID after insert.');
        }
        const actualTransactionId = newTransaction[0].id_transaksi;
        
        // Step 5: Create transaction details using the correct transaction ID
        for (const item of cartItems) {
            const subtotal = item.harga_menu * item.quantity;
            await connection.query(
                `INSERT INTO detail_transaksi (id_transaksi, id_menu, quantity, subtotal)
                 VALUES (?, ?, ?, ?)`,
                [actualTransactionId, item.id_menu, item.quantity, subtotal]
            );
        }
        
        await connection.query('DELETE FROM detail_cart WHERE id_cart = ?', [cartId]);
        await connection.query('DELETE FROM cart WHERE id_cart = ?', [cartId]);
        
        await connection.commit();

        return {
            transactionId: actualTransactionId,
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
 * Get all orders for a specific tenant (seller)
 * @param {string} tenantId - The ID of the tenant
 * @returns {Promise<Array>} A list of orders for the tenant with detailed items
 */
exports.getOrdersByTenantId = async (tenantId) => {
  try {
    const [orders] = await db.query(
      `SELECT 
        t.id_transaksi,
        t.transaction_date,
        t.timeslot,
        t.total_amount,
        t.status,
        u.nama_user as customer_name
      FROM transaksi t
      JOIN msuser u ON t.id_user = u.id_user
      WHERE t.id_tenant = ?
      ORDER BY t.transaction_date DESC`,
      [tenantId]
    );

    // [MODIFIED] For each order, fetch its detailed items
    for (const order of orders) {
      const [items] = await db.query(
        `SELECT
          dt.quantity,
          dt.subtotal,
          m.nama_menu
        FROM detail_transaksi dt
        JOIN menu m ON dt.id_menu = m.id_menu
        WHERE dt.id_transaksi = ?`,
        [order.id_transaksi]
      );
      order.items = items;
    }
    
    return orders;
  } catch (error) {
    console.error('Error in getOrdersByTenantId service:', error);
    throw new Error('Failed to fetch tenant orders');
  }
};

/**
 * Get all orders for a specific user (customer)
 * @param {string} userId - The ID of the user
 * @returns {Promise<Array>} A list of orders for the user
 */
exports.getOrdersByUserId = async (userId) => {
  try {
    const [orders] = await db.query(
      `SELECT 
        t.id_transaksi,
        t.transaction_date,
        t.timeslot,
        t.total_amount,
        t.status,
        ten.nama_tenant
      FROM transaksi t
      JOIN mstenant ten ON t.id_tenant = ten.id_tenant
      WHERE t.id_user = ?
      ORDER BY t.transaction_date DESC`,
      [userId]
    );
    return orders;
  } catch (error) {
    console.error('Error in getOrdersByUserId service:', error);
    throw new Error('Failed to fetch user orders');
  }
};

/**
 * Update order status
 * @param {string} transactionId - The transaction ID
 * @param {string} newStatus - The new status
 * @param {string} userId - The ID of the user making the request
 * @param {string} userRole - The role of the user ('customer' or 'seller')
 * @returns {Promise<Object>} The result of the update operation
 */
exports.updateOrderStatus = async (transactionId, newStatus, userId, userRole) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [transactions] = await connection.query(
      'SELECT * FROM transaksi WHERE id_transaksi = ?',
      [transactionId]
    );

    if (transactions.length === 0) {
      throw new Error('Transaction not found');
    }

    const transaction = transactions[0];
    const currentStatus = transaction.status.trim();
    const newStatusTrimmed = newStatus.trim();
    const newStatusWithSpace = newStatusTrimmed + ' ';

    if (userRole === 'customer') {
      if (transaction.id_user !== userId) {
        throw new Error('You are not authorized to update this order.');
      }
      if (newStatusTrimmed === 'Cancelled' && currentStatus === 'Pending') {
        // Customer can cancel a pending order
      } else {
        throw new Error(`You can only cancel an order that is Pending. Current status: ${currentStatus}`);
      }
    } else if (userRole === 'seller') {
      const allowedTransitions = {
        'Pending': ['On Process', 'Cancelled'],
        'On Process': ['Completed', 'Cancelled'],
      };
      if (!allowedTransitions[currentStatus]?.includes(newStatusTrimmed)) {
        throw new Error(`Cannot change status from ${currentStatus} to ${newStatusTrimmed}.`);
      }
    } else {
      throw new Error('Invalid user role.');
    }

    await connection.query(
      'UPDATE transaksi SET status = ? WHERE id_transaksi = ?',
      [newStatusWithSpace, transactionId]
    );

    await connection.commit();

    return {
      message: 'Order status updated successfully.',
      transactionId,
      newStatus: newStatusTrimmed
    };
  } catch (error) {
    await connection.rollback();
    console.error('Error updating order status:', error.message);
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
    const [transactions] = await db.query(
      `SELECT 
        t.id_transaksi,
        t.transaction_date,
        t.timeslot,
        t.total_amount,
        t.status,
        u.nama_user as customer_name,
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
    throw new Error('Failed to fetch order details');
  }
};
