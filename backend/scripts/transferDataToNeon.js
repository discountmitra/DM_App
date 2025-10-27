require('dotenv').config();
const { Sequelize } = require('sequelize');

// Local DB connection (using local DB credentials)
const localSequelize = new Sequelize(
  process.env.LOCAL_PGDATABASE || 'dm_app',
  process.env.LOCAL_PGUSER || 'postgres',
  process.env.LOCAL_PGPASSWORD || 'root5',
  {
    host: process.env.LOCAL_PGHOST || 'localhost',
    port: process.env.LOCAL_PGPORT || '5432',
    dialect: 'postgres',
    logging: false
  }
);

// Neon DB connection
const neonSequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false
});

// Tables to migrate
const tablesToMigrate = [
  'assets',
  'construction_services',
  'event_services',
  'faqs',
  'healthcare_providers',
  'home_services',
  'offers',
  'restaurants',
  'salons',
  'shopping_items'
];

async function transferTableData(tableName) {
  try {
    console.log(`📦 Transferring ${tableName}...`);
    
    // Get all data from local database
    const [localData] = await localSequelize.query(`SELECT * FROM ${tableName}`);
    
    if (localData.length === 0) {
      console.log(`   ⏭️  No data in ${tableName}`);
      return;
    }

    console.log(`   Found ${localData.length} rows to transfer`);

    // Delete existing data in Neon (optional - comment out if you want to keep existing data)
    await neonSequelize.query(`TRUNCATE TABLE ${tableName} CASCADE`);
    
    // Insert data into Neon in batches
    const batchSize = 100;
    let inserted = 0;
    
    for (let i = 0; i < localData.length; i += batchSize) {
      const batch = localData.slice(i, i + batchSize);
      
      // Get column names
      const columns = Object.keys(batch[0]);
      
      // Create VALUES string for batch insert
      const values = batch.map(row => {
        const rowValues = columns.map(col => {
          const value = row[col];
          if (value === null) return 'NULL';
          if (typeof value === 'string') {
            // Escape single quotes
            return `'${value.replace(/'/g, "''")}'`;
          }
          if (typeof value === 'object') {
            // Handle JSON objects
            return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
          }
          return value;
        });
        return `(${rowValues.join(', ')})`;
      }).join(', ');

      const insertQuery = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES ${values}`;
      
      try {
        await neonSequelize.query(insertQuery);
        inserted += batch.length;
      } catch (err) {
        console.log(`   ⚠️  Error inserting batch: ${err.message}`);
        // Try inserting one by one
        for (const row of batch) {
          try {
            const singleValues = columns.map(col => {
              const value = row[col];
              if (value === null) return 'NULL';
              if (typeof value === 'string') {
                return `'${value.replace(/'/g, "''")}'`;
              }
              if (typeof value === 'object') {
                return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
              }
              return value;
            }).join(', ');
            
            const singleInsert = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${singleValues})`;
            await neonSequelize.query(singleInsert);
            inserted++;
          } catch (singleErr) {
            console.log(`   ⚠️  Skipped one row: ${singleErr.message}`);
          }
        }
      }
    }

    console.log(`   ✅ Transferred ${inserted} rows for ${tableName}`);
  } catch (error) {
    console.error(`   ❌ Error transferring ${tableName}:`, error.message);
  }
}

async function transferDataToNeon() {
  try {
    console.log('🚀 Starting data transfer to Neon DB...\n');

    // Connect to local database
    console.log('📡 Connecting to local database...');
    await localSequelize.authenticate();
    console.log('✅ Connected to local database\n');

    // Connect to Neon database
    console.log('📡 Connecting to Neon database...');
    await neonSequelize.authenticate();
    console.log('✅ Connected to Neon database\n');

    // Transfer each table
    console.log('📦 Starting data transfer...\n');
    
    for (const tableName of tablesToMigrate) {
      await transferTableData(tableName);
    }

    console.log('\n🎉 Data transfer completed successfully!');
    
    // Close connections
    await localSequelize.close();
    await neonSequelize.close();
    
    console.log('✅ All database connections closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Transfer failed:', error);
    process.exit(1);
  }
}

transferDataToNeon();

