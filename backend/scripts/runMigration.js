require('dotenv').config();
const { Sequelize } = require('sequelize');

// Import all models to register them with Sequelize
require('../src/models/User');
require('../src/models/Asset');
require('../src/models/Otp');
require('../src/models/Faq');
require('../src/models/Offer');
require('../src/models/Restaurant');
require('../src/models/Salon');
require('../src/models/HealthcareProvider');
require('../src/models/HomeService');
require('../src/models/ConstructionService');
require('../src/models/EventService');
require('../src/models/ShoppingItem');
require('../src/models/VipSubscription');
require('../src/models/BookingData');
require('../src/models/BillPayment');
require('../src/models/UserFavorites');

const { sequelize } = require('../src/db');

async function createTablesInNeon() {
  try {
    console.log('🚀 Starting migration to Neon DB...\n');
    
    // Test connection
    console.log('📡 Testing connection to Neon database...');
    await sequelize.authenticate();
    console.log('✅ Successfully connected to Neon database!\n');
    
    // Create all tables
    console.log('🔨 Creating tables in Neon database...');
    console.log('   This will create all tables defined in your models\n');
    
    await sequelize.sync({ force: false }); // Don't drop existing tables
    
    console.log('✅ All tables created successfully in Neon database!\n');
    
    console.log('🎉 Migration completed!\n');
    console.log('📝 Next steps:');
    console.log('   1. Import your data using one of these methods:');
    console.log('      - Run your existing seed scripts (npm run seed:*)');
    console.log('      - Or manually import data using SQL commands');
    console.log('   2. Test your application - all routes should work the same\n');
    
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

createTablesInNeon();

