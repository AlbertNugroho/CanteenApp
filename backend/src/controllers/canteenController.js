// Purpose: Handles incoming HTTP requests for canteen-related operations,
// validates input (if any), and calls service functions to interact with data.

const canteenService = require('../services/canteenService');

/**
 * @desc    Get all active canteens
 * @route   GET /api/canteens
 * @access  Public
 */
exports.getAllCanteens = async (req, res) => {
  try {
    const canteens = await canteenService.fetchAllActiveCanteens();
    if (canteens.length === 0) {
      return res.status(200).json({ message: 'No canteens found.', data: [] });
    }
    res.status(200).json({ message: 'Canteens fetched successfully', data: canteens });
  } catch (error) {
    console.error('Error in getAllCanteens controller:', error);
    res.status(500).json({ message: 'Server error fetching canteens', error: error.message });
  }
};

// Example for a future controller function
/**
 * @desc    Get a single canteen by its ID
 * @route   GET /api/canteens/:canteenId
 * @access  Public
 */
// exports.getCanteenById = async (req, res) => {
//   try {
//     const canteenId = req.params.canteenId;
//     const canteen = await canteenService.fetchCanteenDetailsById(canteenId);
//     if (!canteen) {
//       return res.status(404).json({ message: 'Canteen not found' });
//     }
//     res.status(200).json({ message: 'Canteen details fetched successfully', data: canteen });
//   } catch (error) {
//     console.error('Error in getCanteenById controller:', error);
//     res.status(500).json({ message: 'Server error fetching canteen details', error: error.message });
//   }
// };