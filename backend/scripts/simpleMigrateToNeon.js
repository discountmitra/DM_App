require('dotenv').config();
const { Sequelize } = require('sequelize');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

async function migrateToNeon() {
  try {
    console.log('🚀 Starting Simple Migration to Neon DB...\n');

    // Step 1: Create tables in Neon using sequelize.sync()
    console.log('📋 Step 1: Creating tables in Neon database...');
    
    const neonSequelize = process.env.DATABASE_URL 
      ? new Sequelize(process.env.DATABASE_URL, {
          dialect: 'postgres',
          dialectOptions: {
            ssl: {
              require: true,
              rejectUnauthorized: false
            }
          },
          logging: false
        })
      : new Sequelize({
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
        });

    await neonSequelize.authenticate();
    console.log('✅ Connected to Neon database');

    // Import all models to register them
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

    // Create all tables
    await neonSequelize.sync({ alter: false });
    console.log('✅ All tables created successfully\n');

    // Step 2: Use pg_dump and psql to migrate data
    console.log('📦 Step 2: Migrating data from local to Neon...');
    
    const localDbUrl = `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`;
    const neonDbUrl = process.env.DATABASE_URL || 
      `postgresql://${process.env.NEON_PGUSER || process.env.PGUSER}:${process.env.NEON_PGPASSWORD || process.env.PGPASSWORD}@${process.env.NEON_PGHOST || process.env.PGHOST}:${process.env.NEON_PGPORT || process.env.PGPORT}/${process.env.NEON_PGDATABASE || process.env.PGDATABASE}`;
    
    console.log('   Dumping data from local database...');
    
    // Use pg_dump to export data (data only, no schema)
    const dumpCommand = `pg_dump "${localDbUrl}" --data-only --no-owner --no-acl --column-inserts`;
    
    try {
      const { stdout } = await execAsync(dumpCommand);
      
      // Import data into Neon
      console.log('   Importing data into Neon database...');
      const importCommand = `psql "${neonDbUrl}" -c "${stdout}"`;
      await execAsync(importCommand);
      
      console.log('✅ Data migrated successfully!\n');
    } catch (err) {
      console.log('⚠️  pg_dump approach failed, trying alternative method...');
      console.log('   Error:', err.message);
      console.log('\n📝 Alternative: Please run the following commands manually:');
      console.log('\n   1. Export data from local database:');
      console.log(`      pg_dump "${localDbUrl}" --data-only > data.sql`);
      console.log('\n   2. Import data into Neon database:');
      console.log(`      psql "${neonDbUrl}" < data.sql\n`);
      console.log('\n   OR use the sequelize sync approach below...\n');
      
      // Fallback: manual migration instructions
      console.log('💡 Alternative approach:');
      console.log('   1. Your local server will continue to work');
      console.log('   2. Update your .env to use Neon connection');
      console.log('   3. Restart your backend server');
      console.log('   4. Tables will be created automatically');
      console.log('   5. You can manually seed data using your existing seed scripts\n');
    }

    await neonSequelize.close();
    
    console.log('🎉 Migration process completed!');
    console.log('\n📝 Next steps:');
    console.log('   1. Test the connection to Neon DB');
    console.log('   2. Update your production .env to use Neon');
    console.log('   3. Restart your backend server');
    console.log('   4. All APIs should work the same way\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    console.log('\n💡 Fallback: Update your .env file with Neon credentials and restart server');
    process.exit(1);
  }
}

migrateToNeon();

