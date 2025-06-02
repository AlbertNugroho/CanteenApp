// Purpose: Contains the business logic for canteens, including database interactions.

const db = require('../config/db'); // Your database connection pool

/**
 * Fetches all active canteens from the database.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of canteen objects.
 */
exports.fetchAllActiveCanteens = async () => {
  try {
    // Adjust the SQL query based on your actual Canteens table structure and desired fields.
    // It's good practice to select only the columns needed for the list view.
    const sql = `
      SELECT 
        id_tenant, 
        nama_tenant, 
        email_tenant, 
        pw_tenant
      FROM mstenant
      ORDER BY nama_tenant ASC;     
    `;
    // The [rows] destructuring gets the first element of the array returned by db.query, which is the actual data rows.
    const [canteens] = await db.query(sql);
    return canteens;
  } catch (error) {
    console.error('Database error in fetchAllActiveCanteens service:', error);
    // Re-throw the error to be caught by the controller, which will send the HTTP response.
    throw new Error('Failed to fetch canteens from database.');
  }
};

/**
 * Fetches details for a single canteen by its ID. (Example for future use)
 * @param {string|number} canteenId The ID of the canteen to fetch.
 * @returns {Promise<Object|null>} A promise that resolves to the canteen object or null if not found.
 */
// exports.fetchCanteenDetailsById = async (canteenId) => {
//   try {
//     const sql = 'SELECT * FROM Canteens WHERE CanteenID = ? AND IsActive = TRUE';
//     const [canteens] = await db.query(sql, [canteenId]);
//     return canteens[0] || null; // Return the first canteen found, or null
//   } catch (error) {
//     console.error('Database error in fetchCanteenDetailsById service:', error);
//     throw new Error('Failed to fetch canteen details from database.');
//   }
// };