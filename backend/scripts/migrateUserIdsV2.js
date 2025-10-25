require('dotenv').config();
const { sequelize } = require('../src/db');
const { generateUserId } = require('../src/utils/userIdGenerator');

async function migrateUserIdsV2() {
  try {
    console.log('Starting User ID migration (V2)...');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Step 1: Create a new users table with alphanumeric IDs
    console.log('Creating new users table...');
    await sequelize.query(`
      CREATE TABLE users_new (
        id VARCHAR(7) PRIMARY KEY,
        name VARCHAR(120) NOT NULL,
        phone VARCHAR(20) NOT NULL UNIQUE,
        email VARCHAR(160) UNIQUE,
        "isVip" BOOLEAN DEFAULT false,
        "vipExpiresAt" TIMESTAMP,
        "currentSubscriptionId" INTEGER,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    
    // Step 2: Get all existing users
    const users = await sequelize.query('SELECT * FROM users ORDER BY id');
    console.log(`Found ${users[0].length} existing users to migrate.`);
    
    if (users[0].length === 0) {
      console.log('No users to migrate. Migration completed.');
      return;
    }
    
    // Step 3: Migrate each user with new alphanumeric ID
    let migratedCount = 0;
    
    for (const user of users[0]) {
      try {
        // Generate new alphanumeric ID
        const newId = generateUserId();
        
        // Insert into new table
        await sequelize.query(`
          INSERT INTO users_new (id, name, phone, email, "isVip", "vipExpiresAt", "currentSubscriptionId", "createdAt", "updatedAt")
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, {
          replacements: [
            newId,
            user.name,
            user.phone,
            user.email,
            user.isVip,
            user.vipExpiresAt,
            user.currentSubscriptionId,
            user.createdAt,
            user.updatedAt
          ]
        });
        
        // Update related tables with new user ID
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
        
        // Check if vip_subscriptions table exists
        try {
          await sequelize.query(
            'UPDATE vip_subscriptions SET "userId" = ? WHERE "userId" = ?',
            { replacements: [newId, user.id] }
          );
        } catch (error) {
          console.log('vip_subscriptions table not found, skipping...');
        }
        
        migratedCount++;
        console.log(`Migrated user ${user.id} -> ${newId} (${user.name})`);
        
      } catch (error) {
        console.error(`Error migrating user ${user.id}:`, error.message);
      }
    }
    
    // Step 4: Drop old table and rename new table
    console.log('Replacing old users table...');
    await sequelize.query('DROP TABLE users');
    await sequelize.query('ALTER TABLE users_new RENAME TO users');
    
    // Step 5: Recreate indexes
    await sequelize.query('CREATE UNIQUE INDEX users_phone_key ON users (phone)');
    await sequelize.query('CREATE UNIQUE INDEX users_email_key ON users (email) WHERE email IS NOT NULL');
    
    console.log(`\nMigration completed!`);
    console.log(`Successfully migrated: ${migratedCount} users`);
    console.log('All user IDs are now alphanumeric (6-7 characters)');
    
    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateUserIdsV2();
