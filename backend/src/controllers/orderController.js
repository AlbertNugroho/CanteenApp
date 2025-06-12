const orderService = require('../services/orderService');

/**
 * Get available timeslots for a tenant
 * @route GET /api/orders/timeslots/:tenantId
 * @access Public
 */
exports.getAvailableTimeslots = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date parameter is required'
      });
    }

    const timeslots = await orderService.getAvailableTimeslots(tenantId, date);
    
    res.json({
      success: true,
      data: timeslots
    });
  } catch (error) {
    console.error('Error in getAvailableTimeslots controller:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch available timeslots'
    });
  }
};

/**
 * Create transaction from cart
 * @route POST /api/orders/checkout
 * @access Private
 */
exports.createTransaction = async (req, res) => {
  try {
    const { tenantId, timeslot } = req.body;
    const userId = req.user.id; // This comes from the auth middleware

    if (!tenantId || !timeslot) {
      return res.status(400).json({
        success: false,
        message: 'Tenant ID and timeslot are required'
      });
    }

    const transaction = await orderService.checkout(
      userId,
      tenantId,
      timeslot
    );

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: transaction
    });
  } catch (error) {
    console.error('Error in createTransaction controller:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create transaction'
    });
  }
};

/**
 * Get all orders for the logged-in tenant (seller)
 * @route GET /api/orders/tenant
 * @access Private (Seller only)
 */
exports.getOrdersByTenant = async (req, res) => {
  try {
    const tenantId = req.user.id;
    const orders = await orderService.getOrdersByTenantId(tenantId);
    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Error in getOrdersByTenant controller:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch orders'
    });
  }
};


/**
 * Update order status
 * @route PUT /api/orders/:transactionId/status
 * @access Private
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const result = await orderService.updateOrderStatus(
      transactionId,
      status,
      userId,
      userRole
    );

    res.json({
      success: true,
      message: result.message,
      data: result
    });
  } catch (error) {
    console.error('Error in updateOrderStatus controller:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update order status'
    });
  }
};

/**
 * Get order details
 * @route GET /api/orders/:transactionId
 * @access Private
 */
exports.getOrderDetails = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const order = await orderService.getOrderDetails(transactionId);

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error in getOrderDetails controller:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch order details'
    });
  }
};
