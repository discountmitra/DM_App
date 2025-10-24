require('dotenv').config();
const { sequelize } = require('../src/db');

async function migrateBillPayments() {
  try {
    console.log('Starting BillPayment table migration...');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Import and initialize the BillPayment model
    const BillPayment = require('../src/models/BillPayment');
    
    // Sync the BillPayment model (create table if not exists)
    await BillPayment.sync({ force: false });
    console.log('BillPayment table created/verified successfully.');
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await sequelize.close();
  }
}

migrateBillPayments();
