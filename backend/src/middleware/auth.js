const jwt = require('jsonwebtoken');

/**
 * Middleware to verify JWT token
 */
exports.auth = (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token, authorization denied'
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user data to request
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token is not valid'
    });
  }
};

/**
 * Middleware to check if user is a seller (tenant)
 */
exports.sellerAuth = (req, res, next) => {
  if (req.user.role !== 'seller') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Sellers only.'
    });
  }
  next();
};

/**
 * Middleware to check if user is a customer
 */
exports.customerAuth = (req, res, next) => {
  if (req.user.role !== 'customer') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Customers only.'
    });
  }
  next();
}; 