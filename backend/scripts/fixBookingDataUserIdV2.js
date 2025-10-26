require('dotenv').config();
const { sequelize } = require('../src/db');
const User = require('../src/models/User');

async function fixBookingDataUserIdV2() {
  try {
    console.log('Fixing booking_data userId column...');
    
    // Get all unique alphanumeric userIds from booking_data
    const [alphanumericUserIds] = await sequelize.query(`
      SELECT DISTINCT "userId" 
      FROM booking_data 
      WHERE "userId" !~ '^[0-9]+$'
    `);
    
    console.log(`Found ${alphanumericUserIds.length} bookings with alphanumeric userIds`);
    
    // For each alphanumeric ID, find the corresponding integer ID
    let fixed = 0;
    for (const row of alphanumericUserIds) {
      const alphanumericId = row.userId;
      
      // Find the user with this newId
      const user = await User.findOne({ where: { newId: alphanumericId } });
      
      if (user) {
        // Update all bookings with this alphanumeric ID to use the integer ID
        await sequelize.query(`
          UPDATE booking_data 
          SET "userId" = ? 
          WHERE "userId" = ?
        `, { replacements: [user.id, alphanumericId] });
        
        fixed++;
        console.log(`Updated bookings for user ${alphanumericId} -> ${user.id}`);
      } else {
        console.log(`⚠️  No user found with newId: ${alphanumericId}`);
      }
    }
    
    console.log(`\n✅ Fixed ${fixed} bookings`);
    
    // Now convert the column type to INTEGER
    console.log('\nConverting userId column to INTEGER...');
    await sequelize.query(`
      ALTER TABLE booking_data 
      ALTER COLUMN "userId" TYPE INTEGER USING "userId"::INTEGER
    `);
    
    console.log('✅ Successfully changed userId column to INTEGER');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing booking_data userId:', error);
    process.exit(1);
  }
}

fixBookingDataUserIdV2();

