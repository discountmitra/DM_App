require('dotenv').config();
const { sequelize } = require('../src/db');
const UserFavorites = require('../src/models/UserFavorites');

async function migrateUserFavorites() {
  try {
    console.log('Starting UserFavorites migration...');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Drop and recreate the table to ensure clean state
    await UserFavorites.sync({ force: true });
    console.log('UserFavorites table created/verified successfully.');
    
    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateUserFavorites();
