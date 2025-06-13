const db = require('../config/db');

/**
 * Get cart items for a user and a specific tenant
 * @param {string} userId - The user's ID
 * @param {string} tenantId - The tenant's ID
 * @returns {Promise<Array>} Array of cart items with menu details
 */
exports.getCartItems = async (userId, tenantId) => {
  try {
    // Get the cart items for a specific user and tenant
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
      WHERE c.id_user = ? AND c.id_tenant = ?
      ORDER BY dc.id_detail_cart DESC`,
      [userId, tenantId]
    );

    console.log('Retrieved cart items for tenant:', tenantId, cartItems);
    return cartItems || [];
  } catch (error) {
    console.error('Error in getCartItems service:', error);
    throw new Error('Failed to fetch cart items');
  }
};


/**
 * Add item to cart or update its quantity.
 * If the user adds an item from a new tenant, the old cart is cleared first.
 * @param {string} userId - The user's ID
 * @param {string} menuId - The menu item's ID
 * @param {string} tenantId - The tenant's ID for the new item
 * @param {number} quantity - Quantity to add
 * @returns {Promise<Object>} Added or updated cart item details
 */
exports.addToCart = async (userId, menuId, tenantId, quantity) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();
    console.log('Starting addToCart transaction...');

    // 1. Check menu availability first
    const [menuItem] = await connection.query(
      `SELECT availability, nama_menu, harga_menu
       FROM menu
       WHERE id_menu = ? AND id_tenant = ?`,
      [menuId, tenantId]
    );

    if (!menuItem.length || !menuItem[0].availability) {
      throw new Error('Menu item is not available or not found for this tenant');
    }

    // 2. Check if the user has an existing cart with a DIFFERENT tenant
    const [existingCarts] = await connection.query(
        'SELECT id_cart, id_tenant FROM cart WHERE id_user = ?',
        [userId]
    );
    
    // **THE FIX**: Explicitly delete child rows before parent row to avoid constraint errors.
    if (existingCarts.length > 0 && existingCarts[0].id_tenant !== tenantId) {
        const oldCartId = existingCarts[0].id_cart;
        console.log(`User is switching tenants. Clearing old cart ID: ${oldCartId}`);
        
        // Explicitly delete items from detail_cart first
        await connection.query('DELETE FROM detail_cart WHERE id_cart = ?', [oldCartId]);
        
        // Then delete the parent cart record
        await connection.query('DELETE FROM cart WHERE id_cart = ?', [oldCartId]);
        
        console.log('Old cart cleared successfully.');
    }

    // 3. Find or create the cart for the user and the CURRENT tenant
    let [cart] = await connection.query(
      'SELECT id_cart FROM cart WHERE id_user = ? AND id_tenant = ?',
      [userId, tenantId]
    );

    let cartId;
    if (cart.length === 0) {
      console.log('Creating new cart for user:', userId, 'and tenant:', tenantId);
      await connection.query(
        'INSERT INTO cart (id_user, id_tenant) VALUES (?, ?)',
        [userId, tenantId]
      );
      
      const [newlyCreatedCart] = await connection.query(
        'SELECT id_cart FROM cart WHERE id_user = ? AND id_tenant = ?',
        [userId, tenantId]
      );
      cartId = newlyCreatedCart[0].id_cart;
      console.log('Created new cart with ID:', cartId);
    } else {
      cartId = cart[0].id_cart;
      console.log('Using existing cart with ID:', cartId);
    }

    // 4. Check if the item already exists in the cart (Upsert logic)
    const [existingItem] = await connection.query(
      'SELECT quantity FROM detail_cart WHERE id_cart = ? AND id_menu = ?',
      [cartId, menuId]
    );

    let finalQuantity;
    if (existingItem.length > 0) {
      finalQuantity = existingItem[0].quantity + quantity;
      await connection.query(
        'UPDATE detail_cart SET quantity = ? WHERE id_cart = ? AND id_menu = ?',
        [finalQuantity, cartId, menuId]
      );
    } else {
      finalQuantity = quantity;
      await connection.query(
        'INSERT INTO detail_cart (id_cart, id_menu, quantity) VALUES (?, ?, ?)',
        [cartId, menuId, quantity]
      );
    }
    
    // 5. Commit transaction
    await connection.commit();
    console.log('Transaction committed successfully');

    // 6. Return details of the affected item
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

    const [cart] = await connection.query(
      `SELECT c.id_cart
       FROM cart c
       JOIN detail_cart dc ON c.id_cart = dc.id_cart
       WHERE c.id_user = ? AND dc.id_menu = ?`,
      [userId, menuId]
    );

    if (cart.length === 0) {
      throw new Error('Cart item not found for this user.');
    }
    const cartId = cart[0].id_cart;

    if (quantity <= 0) {
      await connection.query(
        'DELETE FROM detail_cart WHERE id_cart = ? AND id_menu = ?',
        [cartId, menuId]
      );
      const [remainingItems] = await connection.query(
          'SELECT COUNT(*) as count FROM detail_cart WHERE id_cart = ?',
          [cartId]
      );
      if (remainingItems[0].count === 0) {
          await connection.query('DELETE FROM cart WHERE id_cart = ?', [cartId]);
      }
      await connection.commit();
      return { message: 'Item removed from cart.' };
    }

    await connection.query(
      `UPDATE detail_cart
       SET quantity = ?
       WHERE id_cart = ? AND id_menu = ?`,
      [quantity, cartId, menuId]
    );

    await connection.commit();

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
      [cartId, menuId]
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
    const cartId = cart[0].id_cart;

    await connection.query(
      `DELETE FROM detail_cart
       WHERE id_cart = ? AND id_menu = ?`,
      [cartId, menuId]
    );

    const [remainingItems] = await connection.query(
      'SELECT COUNT(*) as count FROM detail_cart WHERE id_cart = ?',
      [cartId]
    );

    if (remainingItems[0].count === 0) {
      await connection.query(
        'DELETE FROM cart WHERE id_cart = ?',
        [cartId]
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
