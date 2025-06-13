const db = require('../config/db');

/**
 * Get cart items for a user
 * @param {string} userId - The user's ID
 * @returns {Promise<Array>} Array of cart items with menu details
 */
exports.getCartItems = async (userId) => {
  try {
    // Get the cart items using LEFT JOINs to handle empty carts
    const [cartItems] = await db.query(
      `SELECT 
        m.id_menu,
        m.nama_menu,
        m.harga_menu,
        m.gambar_menu,
        dc.quantity,
        m.id_tenant,
        t.nama_tenant
      FROM cart c
      INNER JOIN detail_cart dc ON c.id_cart = dc.id_cart
      INNER JOIN menu m ON dc.id_menu = m.id_menu
      INNER JOIN mstenant t ON m.id_tenant = t.id_tenant
      WHERE c.id_user = ?
      ORDER BY dc.id_detail_cart DESC`,
      [userId]
    );
    
    console.log('Retrieved cart items:', cartItems);
    return cartItems || [];
  } catch (error) {
    console.error('Error in getCartItems service:', error);
    throw new Error('Failed to fetch cart items');
  }
};

/**
 * Add item to cart or update its quantity. Works with trigger-based VARCHAR IDs.
 * @param {string} userId - The user's ID
 * @param {string} menuId - The menu item's ID
 * @param {string} tenantId - The tenant's ID
 * @param {number} quantity - Quantity to add
 * @returns {Promise<Object>} Added or updated cart item details
 */
exports.addToCart = async (userId, menuId, tenantId, quantity) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    console.log('Starting addToCart transaction...');

    // 1. Check menu availability
    const [menuItem] = await connection.query(
      `SELECT availability, nama_menu, harga_menu 
       FROM menu 
       WHERE id_menu = ?`,
      [menuId]
    );

    if (!menuItem.length || !menuItem[0].availability) {
      throw new Error('Menu item is not available or not found');
    }

    // 2. Find or create the cart for the user and tenant
    let [cart] = await connection.query(
      'SELECT id_cart FROM cart WHERE id_user = ? AND id_tenant = ?',
      [userId, tenantId]
    );

    let cartId;
    if (cart.length === 0) {
      console.log('Creating new cart for user:', userId, 'tenant:', tenantId);
      // Insert the new cart record. The trigger will auto-generate the id_cart.
      await connection.query(
        'INSERT INTO cart (id_user, id_tenant) VALUES (?, ?)',
        [userId, tenantId]
      );
      
      // *** THE FIX: Fetch the ID that the trigger just created ***
      // We query for the cart we just made to get its trigger-generated ID.
      const [newlyCreatedCart] = await connection.query(
        'SELECT id_cart FROM cart WHERE id_user = ? AND id_tenant = ?',
        [userId, tenantId]
      );
      
      if (!newlyCreatedCart.length) {
          throw new Error('Failed to create or retrieve cart after insert.');
      }

      cartId = newlyCreatedCart[0].id_cart;
      console.log('Created new cart with trigger-generated ID:', cartId);
    } else {
      cartId = cart[0].id_cart;
      console.log('Using existing cart with ID:', cartId);
    }

    // 3. Check if the item already exists in the cart (Upsert logic)
    const [existingItem] = await connection.query(
      'SELECT quantity FROM detail_cart WHERE id_cart = ? AND id_menu = ?',
      [cartId, menuId]
    );

    let finalQuantity;
    if (existingItem.length > 0) {
      // Item exists, UPDATE the quantity
      finalQuantity = existingItem[0].quantity + quantity;
      await connection.query(
        'UPDATE detail_cart SET quantity = ? WHERE id_cart = ? AND id_menu = ?',
        [finalQuantity, cartId, menuId]
      );
    } else {
      // Item does not exist, INSERT it
      finalQuantity = quantity;
      await connection.query(
        'INSERT INTO detail_cart (id_cart, id_menu, quantity) VALUES (?, ?, ?)',
        [cartId, menuId, quantity]
      );
    }
    
    // 4. Commit transaction
    await connection.commit();
    console.log('Transaction committed successfully');

    // 5. Return details of the affected item
    return {
      id_menu: menuId,
      nama_menu: menuItem[0].nama_menu,
      harga_menu: menuItem[0].harga_menu,
      quantity: finalQuantity,
      id_tenant: tenantId
    };

  } catch (error) {
    console.error('Error in addToCart service:', error);
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Update cart item quantity
 * @param {string} userId - The user's ID
 * @param {string} menuId - The menu item's ID
 * @param {number} quantity - New quantity
 * @returns {Promise<Object>} Updated cart item details
 */
exports.updateCartItem = async (userId, menuId, quantity) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    if (quantity <= 0) {
      // Delete item if quantity is 0 or negative
      await this.deleteCartItem(userId, menuId);
      await connection.commit();
      return null;
    }

    // Check menu availability
    const [menuItem] = await connection.query(
      `SELECT availability 
       FROM menu 
       WHERE id_menu = ?`,
      [menuId]
    );

    if (!menuItem.length || menuItem[0].availability === null) {
      throw new Error('Menu item not found');
    }

    if (!menuItem[0].availability) {
      throw new Error('This item is out of stock');
    }

    if (quantity > menuItem[0].availability) {
      throw new Error(`Cannot update quantity to ${quantity}. Only ${menuItem[0].availability} available`);
    }

    // Get cart ID
    const [cart] = await connection.query(
      `SELECT c.id_cart 
       FROM cart c 
       JOIN detail_cart dc ON c.id_cart = dc.id_cart 
       WHERE c.id_user = ? AND dc.id_menu = ?`,
      [userId, menuId]
    );

    if (cart.length === 0) {
      throw new Error('Cart item not found');
    }

    // Update quantity
    await connection.query(
      `UPDATE detail_cart 
       SET quantity = ? 
       WHERE id_cart = ? AND id_menu = ?`,
      [quantity, cart[0].id_cart, menuId]
    );

    await connection.commit();

    // Get updated cart item
    const [updatedItem] = await connection.query(
      `SELECT 
        m.id_menu,
        m.nama_menu,
        m.harga_menu,
        dc.quantity,
        m.id_tenant
      FROM detail_cart dc
      JOIN menu m ON dc.id_menu = m.id_menu
      WHERE dc.id_cart = ? AND dc.id_menu = ?`,
      [cart[0].id_cart, menuId]
    );

    return updatedItem[0];
  } catch (error) {
    await connection.rollback();
    console.error('Error in updateCartItem service:', error);
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Delete item from cart
 * @param {string} userId - The user's ID
 * @param {string} menuId - The menu item's ID
 * @returns {Promise<void>}
 */
exports.deleteCartItem = async (userId, menuId) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    // Get cart ID
    const [cart] = await connection.query(
      `SELECT c.id_cart 
       FROM cart c 
       JOIN detail_cart dc ON c.id_cart = dc.id_cart 
       WHERE c.id_user = ? AND dc.id_menu = ?`,
      [userId, menuId]
    );

    if (cart.length === 0) {
      throw new Error('Cart item not found');
    }

    // Delete the item
    await connection.query(
      `DELETE FROM detail_cart 
       WHERE id_cart = ? AND id_menu = ?`,
      [cart[0].id_cart, menuId]
    );

    // Check if cart is empty
    const [remainingItems] = await connection.query(
      'SELECT COUNT(*) as count FROM detail_cart WHERE id_cart = ?',
      [cart[0].id_cart]
    );

    // If cart is empty, delete it
    if (remainingItems[0].count === 0) {
      await connection.query(
        'DELETE FROM cart WHERE id_cart = ?',
        [cart[0].id_cart]
      );
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    console.error('Error in deleteCartItem service:', error);
    throw error;
  } finally {
    connection.release();
  }
};