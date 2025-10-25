require('dotenv').config();
const { sequelize } = require('../src/db');
const User = require('../src/models/User');
const { generateUniqueUserId } = require('../src/utils/userIdGenerator');

async function migrateUserIds() {
  try {
    console.log('Starting User ID migration...');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Get all existing users
    const users = await User.findAll();
    console.log(`Found ${users.length} existing users to migrate.`);
    
    if (users.length === 0) {
      console.log('No users to migrate. Migration completed.');
      return;
    }
    
    // Create a temporary table to store old ID mappings
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS user_id_mapping (
        old_id INTEGER,
        new_id VARCHAR(7),
        PRIMARY KEY (old_id)
      )
    `);
    
    let migratedCount = 0;
    let errorCount = 0;
    
    for (const user of users) {
      try {
        // Skip if user already has alphanumeric ID
        if (typeof user.id === 'string' && user.id.length >= 6) {
          console.log(`User ${user.id} already has alphanumeric ID, skipping...`);
          continue;
        }
        
        // Generate new alphanumeric ID
        const newId = await generateUniqueUserId(User);
        
        // Store mapping
        await sequelize.query(
          'INSERT INTO user_id_mapping (old_id, new_id) VALUES (?, ?) ON CONFLICT (old_id) DO NOTHING',
          { replacements: [user.id, newId] }
        );
        
        // Update user with new ID
        await sequelize.query(
          'UPDATE users SET id = ? WHERE id = ?',
          { replacements: [newId, user.id] }
        );
        
        // Update related tables
        await sequelize.query(
          'UPDATE booking_data SET "userId" = ? WHERE "userId" = ?',
          { replacements: [newId, user.id] }
        );
        
        await sequelize.query(
          'UPDATE bill_payments SET "userId" = ? WHERE "userId" = ?',
          { replacements: [newId, user.id] }
        );
        
        await sequelize.query(
          'UPDATE user_favorites SET "userId" = ? WHERE "userId" = ?',
          { replacements: [newId, user.id] }
        );
        
        await sequelize.query(
          'UPDATE vip_subscriptions SET "userId" = ? WHERE "userId" = ?',
          { replacements: [newId, user.id] }
        );
        
        migratedCount++;
        console.log(`Migrated user ${user.id} -> ${newId}`);
        
      } catch (error) {
        errorCount++;
        console.error(`Error migrating user ${user.id}:`, error.message);
      }
    }
    
    console.log(`\nMigration completed!`);
    console.log(`Successfully migrated: ${migratedCount} users`);
    console.log(`Errors: ${errorCount} users`);
    
    // Clean up temporary table
    await sequelize.query('DROP TABLE IF EXISTS user_id_mapping');
    
    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateUserIds();
