/**
 * Generates a unique alphanumeric user ID
 * Format: 6-7 characters, mix of letters and numbers
 * Example: A1B2C3, X9Y8Z7, etc.
 */
function generateUserId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  
  // Generate 6-7 characters (randomly choose length)
  const length = Math.random() < 0.5 ? 6 : 7;
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}

/**
 * Generates a unique user ID that doesn't already exist in the database
 * @param {Object} User - Sequelize User model
 * @returns {Promise<string>} - Unique alphanumeric user ID
 */
async function generateUniqueUserId(User) {
  let userId;
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 100; // Prevent infinite loops
  
  while (!isUnique && attempts < maxAttempts) {
    userId = generateUserId();
    
    try {
      // Check if newId already exists
      const existingUser = await User.findOne({ where: { newId: userId } });
      if (!existingUser) {
        isUnique = true;
      }
    } catch (error) {
      // If there's an error checking, assume it's unique and let the database handle conflicts
      isUnique = true;
    }
    
    attempts++;
  }
  
  if (!isUnique) {
    throw new Error('Unable to generate unique user ID after maximum attempts');
  }
  
  return userId;
}

module.exports = {
  generateUserId,
  generateUniqueUserId
};
