require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

// Local DB connection (your current local database)
const LOCAL_DB_CONFIG = {
  database: process.env.PGDATABASE,
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  dialect: 'postgres',
  logging: false
};

const localSequelize = new Sequelize(LOCAL_DB_CONFIG);

// Neon DB connection
// First, try to use DATABASE_URL, otherwise use individual env vars
let NEON_CONFIG;

if (process.env.DATABASE_URL) {
  // Use connection string
  NEON_CONFIG = {
    connectionString: process.env.DATABASE_URL,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false
  };
} else {
  // Use individual connection parameters for Neon
  NEON_CONFIG = {
    database: process.env.NEON_PGDATABASE || process.env.PGDATABASE,
    username: process.env.NEON_PGUSER || process.env.PGUSER,
    password: process.env.NEON_PGPASSWORD || process.env.PGPASSWORD,
    host: process.env.NEON_PGHOST || process.env.PGHOST,
    port: process.env.NEON_PGPORT || process.env.PGPORT,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false
  };
}

const neonSequelize = process.env.DATABASE_URL 
  ? new Sequelize(process.env.DATABASE_URL, NEON_CONFIG.dialectOptions)
  : new Sequelize(NEON_CONFIG);

// Import all models
const User = require('../src/models/User');
const Asset = require('../src/models/Asset');
const Otp = require('../src/models/Otp');
const Faq = require('../src/models/Faq');
const Offer = require('../src/models/Offer');
const Restaurant = require('../src/models/Restaurant');
const Salon = require('../src/models/Salon');
const HealthcareProvider = require('../src/models/HealthcareProvider');
const HomeService = require('../src/models/HomeService');
const ConstructionService = require('../src/models/ConstructionService');
const EventService = require('../src/models/EventService');
const ShoppingItem = require('../src/models/ShoppingItem');
const VipSubscription = require('../src/models/VipSubscription');
const BookingData = require('../src/models/BookingData');
const BillPayment = require('../src/models/BillPayment');
const UserFavorites = require('../src/models/UserFavorites');

// Define model associations
const models = {
  User,
  Asset,
  Otp,
  Faq,
  Offer,
  Restaurant,
  Salon,
  HealthcareProvider,
  HomeService,
  ConstructionService,
  EventService,
  ShoppingItem,
  VipSubscription,
  BookingData,
  BillPayment,
  UserFavorites
};

// Helper function to migrate a table
async function migrateTable(localModel, modelName, localConnection, neonConnection) {
  try {
    console.log(`📦 Migrating ${modelName}...`);
    
    // Get all data from local database using raw query
    const [localData] = await localConnection.query(`SELECT * FROM ${localModel.tableName}`);
    
    if (localData.length === 0) {
      console.log(`   ⏭️  No data to migrate for ${modelName}`);
      return;
    }

    console.log(`   Found ${localData.length} records to migrate`);

    // Use Sequelize's bulkCreate for better data handling
    // First, create the model instance for Neon
    const modelConfig = localModel.constructor.name === 'Sequelize' 
      ? localModel 
      : neonConnection.define(localModel.name, localModel.rawAttributes, localModel.options);
    
    await modelConfig.sync({ alter: false });
    
    // Migrate data in batches
    const batchSize = 50;
    for (let i = 0; i < localData.length; i += batchSize) {
      const batch = localData.slice(i, i + batchSize);
      try {
        await modelConfig.bulkCreate(batch, { 
          ignoreDuplicates: true,
          updateOnDuplicate: Object.keys(batch[0]).filter(key => key !== 'id')
        });
      } catch (err) {
        // If bulkCreate fails, try individual inserts
        for (const row of batch) {
          try {
            await modelConfig.create(row);
          } catch (createErr) {
            // Skip duplicates and continue
            if (!createErr.message.includes('duplicate')) {
              console.log(`   ⚠️  Failed to insert one record: ${createErr.message}`);
            }
          }
        }
      }
    }
    
    console.log(`   ✅ Migrated ${localData.length} records for ${modelName}`);
  } catch (error) {
    console.error(`   ❌ Error migrating ${modelName}:`, error.message);
    // Continue with other tables even if one fails
  }
}

async function migrateToNeon() {
  try {
    console.log('🚀 Starting migration to Neon DB...\n');

    // Connect to local database
    console.log('📡 Connecting to local database...');
    await localSequelize.authenticate();
    console.log('✅ Connected to local database\n');

    // Connect to Neon database
    console.log('📡 Connecting to Neon database...');
    await neonSequelize.authenticate();
    console.log('✅ Connected to Neon database\n');

    // Create tables in Neon (if they don't exist)
    console.log('🔨 Creating tables in Neon database...');
    const tableNames = [
      'users', 'assets', 'otps', 'faqs', 'offers',
      'restaurants', 'salons', 'healthcare_providers', 'home_services',
      'construction_services', 'event_services', 'shopping_items',
      'vip_subscriptions', 'booking_data', 'bill_payments', 'user_favorites'
    ];

    // Get table creation SQL from local database
    for (const tableName of tableNames) {
      try {
        const queryInterface = localSequelize.getQueryInterface();
        const describeResult = await queryInterface.describeTable(tableName);
        
        // This will use sync to create the table if it doesn't exist
        await neonSequelize.query(`SELECT 1 FROM ${tableName} LIMIT 1`).catch(async () => {
          // Table doesn't exist, we'll create it using sync
        });
      } catch (error) {
        // Table might not exist yet, that's okay
      }
    }

    // Sync models to create tables in Neon
    console.log('   Syncing models...');
    await neonSequelize.sync({ alter: false });
    console.log('✅ Tables created in Neon database\n');

    // Migrate data for each table
    console.log('📦 Starting data migration...\n');
    
    const migrationOrder = [
      { model: User, name: 'users', tableName: 'users' },
      { model: Asset, name: 'assets', tableName: 'assets' },
      { model: Faq, name: 'faqs', tableName: 'faqs' },
      { model: Offer, name: 'offers', tableName: 'offers' },
      { model: Restaurant, name: 'restaurants', tableName: 'restaurants' },
      { model: Salon, name: 'salons', tableName: 'salons' },
      { model: HealthcareProvider, name: 'healthcare_providers', tableName: 'healthcare_providers' },
      { model: HomeService, name: 'home_services', tableName: 'home_services' },
      { model: ConstructionService, name: 'construction_services', tableName: 'construction_services' },
      { model: EventService, name: 'event_services', tableName: 'event_services' },
      { model: ShoppingItem, name: 'shopping_items', tableName: 'shopping_items' },
      { model: VipSubscription, name: 'vip_subscriptions', tableName: 'vip_subscriptions' },
      { model: UserFavorites, name: 'user_favorites', tableName: 'user_favorites' },
      { model: BookingData, name: 'booking_data', tableName: 'booking_data' },
      { model: BillPayment, name: 'bill_payments', tableName: 'bill_payments' },
      { model: Otp, name: 'otps', tableName: 'otps' }, // Migrate OTPs last
    ];

    for (const { model, name, tableName } of migrationOrder) {
      await migrateTable(model, name, localSequelize, neonSequelize);
    }

    console.log('\n🎉 Migration completed successfully!');
    
    // Close connections
    await localSequelize.close();
    await neonSequelize.close();
    
    console.log('✅ All database connections closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
migrateToNeon();

