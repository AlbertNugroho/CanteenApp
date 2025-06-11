const cartService = require('../services/cartService');

/**
 * Get cart items for the authenticated user
 * @route GET /api/cart
 * @access Private
 */
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cartItems = await cartService.getCartItems(userId);
    
    res.json({
      success: true,
      data: cartItems
    });
  } catch (error) {
    console.error('Error in getCart controller:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch cart items'
    });
  }
};

/**
 * Add item to cart
 * @route POST /api/cart/add
 * @access Private
 */
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { menuId, tenantId, quantity, addons } = req.body;

    if (!menuId || !tenantId || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'Menu ID, tenant ID, and quantity are required'
      });
    }

    const result = await cartService.addToCart(userId, menuId, tenantId, quantity, addons);
    
    res.status(201).json({
      success: true,
      message: 'Item added to cart successfully',
      data: result
    });
  } catch (error) {
    console.error('Error in addToCart controller:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to add item to cart'
    });
  }
};

/**
 * Update cart item quantity
 * @route PUT /api/cart/update
 * @access Private
 */
exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { menuId, quantity } = req.body;

    if (!menuId || typeof quantity !== 'number') {
      return res.status(400).json({
        success: false,
        message: 'Menu ID and quantity are required'
      });
    }

    const result = await cartService.updateCartItem(userId, menuId, quantity);
    
    res.json({
      success: true,
      message: 'Cart item updated successfully',
      data: result
    });
  } catch (error) {
    console.error('Error in updateCartItem controller:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update cart item'
    });
  }
};

/**
 * Delete item from cart
 * @route DELETE /api/cart/delete/:menuId
 * @access Private
 */
exports.deleteCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { menuId } = req.params;

    await cartService.deleteCartItem(userId, menuId);
    
    res.json({
      success: true,
      message: 'Cart item deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteCartItem controller:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete cart item'
    });
  }
}; 