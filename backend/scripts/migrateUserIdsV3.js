require('dotenv').config();
const { sequelize } = require('../src/db');
const { generateUserId } = require('../src/utils/userIdGenerator');

async function migrateUserIdsV3() {
  try {
    console.log('Starting User ID migration (V3)...');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Step 1: Add a new column for alphanumeric ID
    console.log('Adding new alphanumeric ID column...');
    try {
      await sequelize.query('ALTER TABLE users ADD COLUMN new_id VARCHAR(7)');
      console.log('Added new_id column successfully.');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('new_id column already exists, continuing...');
      } else {
        throw error;
      }
    }
    
    // Step 2: Get all existing users
    const users = await sequelize.query('SELECT * FROM users ORDER BY id');
    console.log(`Found ${users[0].length} existing users to migrate.`);
    
    if (users[0].length === 0) {
      console.log('No users to migrate. Migration completed.');
      return;
    }
    
    // Step 3: Generate alphanumeric IDs for all users
    let migratedCount = 0;
    
    for (const user of users[0]) {
      try {
        // Generate new alphanumeric ID
        const newId = generateUserId();
        
        // Update user with new alphanumeric ID
        await sequelize.query(
          'UPDATE users SET new_id = ? WHERE id = ?',
          { replacements: [newId, user.id] }
        );
        
        migratedCount++;
        console.log(`Generated new ID for user ${user.id} -> ${newId} (${user.name})`);
        
      } catch (error) {
        console.error(`Error processing user ${user.id}:`, error.message);
      }
    }
    
    console.log(`\nGenerated alphanumeric IDs for ${migratedCount} users`);
    console.log('Migration completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Update your application to use the new_id field');
    console.log('2. After confirming everything works, you can drop the old id column');
    console.log('3. Rename new_id to id if desired');
    
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateUserIdsV3();
