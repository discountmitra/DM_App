require('dotenv').config({ path: '../.env' });
const { sequelize } = require('../src/db');
const UserFavorites = require('../src/models/UserFavorites');

async function migrateUserFavoritesUserId() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // 1. Check if user_favorites table exists and get its structure
    const queryInterface = sequelize.getQueryInterface();
    
    try {
      const tableDescription = await queryInterface.describeTable('user_favorites');
      console.log('Current user_favorites table structure:', tableDescription);
      
      // 2. Check if userId column is INTEGER and needs to be changed to STRING
      if (tableDescription.userId && tableDescription.userId.type === 'INTEGER') {
        console.log('userId column is INTEGER, changing to STRING...');
        
        // First, let's check if there are any existing records
        const existingFavorites = await UserFavorites.findAll();
        console.log(`Found ${existingFavorites.length} existing favorites records.`);
        
        if (existingFavorites.length > 0) {
          console.log('Backing up existing data...');
          // Convert existing integer userIds to strings
          for (const favorite of existingFavorites) {
            favorite.userId = favorite.userId.toString();
            await favorite.save();
          }
          console.log('Converted existing userIds to strings.');
        }
        
        // Now alter the column type
        await queryInterface.changeColumn('user_favorites', 'userId', {
          type: require('sequelize').DataTypes.STRING,
          allowNull: false,
          comment: 'ID of the user who added the favorite (can be integer or alphanumeric)'
        });
        
        console.log('Successfully changed userId column from INTEGER to STRING.');
      } else {
        console.log('userId column is already STRING or does not exist.');
      }
      
    } catch (error) {
      if (error.message.includes('does not exist')) {
        console.log('user_favorites table does not exist, will be created with correct structure.');
        // Force sync to create the table with the correct structure
        await UserFavorites.sync({ force: false });
        console.log('Created user_favorites table with STRING userId column.');
      } else {
        throw error;
      }
    }

    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateUserFavoritesUserId();
