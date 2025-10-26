require('dotenv').config();
const { sequelize } = require('../src/db');

async function fixBookingDataUserId() {
  try {
    console.log('Checking booking_data table structure...');
    
    // Check current type of userId column
    const [results] = await sequelize.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'booking_data' 
      AND column_name = 'userId'
    `);
    
    console.log('Current userId column type:', results[0]?.data_type);
    
    if (results[0]?.data_type === 'character varying') {
      console.log('userId column is VARCHAR, fixing to INTEGER...');
      
      // Alter the column to INTEGER
      await sequelize.query(`
        ALTER TABLE booking_data 
        ALTER COLUMN "userId" TYPE INTEGER USING "userId"::INTEGER
      `);
      
      console.log('✅ Successfully changed userId column to INTEGER');
    } else if (results[0]?.data_type === 'integer') {
      console.log('✅ userId column is already INTEGER, no changes needed');
    } else {
      console.log('⚠️  Unknown column type:', results[0]?.data_type);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing booking_data userId:', error);
    process.exit(1);
  }
}

fixBookingDataUserId();

