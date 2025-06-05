const authService = require('../services/authService');

/**
 * Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
exports.register = async (req, res) => {
  try {
    const { userType } = req.params;
    
    if (!['customer', 'seller'].includes(userType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user type'
      });
    }
    
    const user = await authService.register(req.body, userType);
    
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: user
    });
  } catch (error) {
    console.error('Error in register controller:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Registration failed'
    });
  }
};

/**
 * Login user
 * @route POST /api/auth/login
 * @access Public
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }
    
    const data = await authService.login(email, password);
    
    res.json({
      success: true,
      message: 'Login successful',
      data
    });
  } catch (error) {
    console.error('Error in login controller:', error);
    res.status(401).json({
      success: false,
      message: error.message || 'Login failed'
    });
  }
}; 