const { Sequelize, DataTypes } = require('sequelize');

// Source DB (old): default 'postgres'
const source = new Sequelize(
  process.env.PGSOURCEDB,
  process.env.PGUSER ,
  process.env.PGPASSWORD ,
  {
    host: process.env.PGHOST ,
    port: process.env.PGPORT ,
    dialect: 'postgres',
    logging: false,
  }
);

// Target DB (new): 'dm_app'
const target = new Sequelize(
  process.env.PGDATABASE ,
  process.env.PGUSER ,
  process.env.PGPASSWORD ,
  {
    host: process.env.PGHOST ,
    port: process.env.PGPORT ,
    dialect: 'postgres',
    logging: false,
  }
);

function defineEventService(sequelize) {
  return sequelize.define('EventService', {
    id: { type: DataTypes.STRING, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    category: { type: DataTypes.STRING, allowNull: false },
    icon: { type: DataTypes.STRING },
    price: { type: DataTypes.STRING },
    details: { type: DataTypes.TEXT },
    capacity: { type: DataTypes.STRING },
    location: { type: DataTypes.STRING },
    rating: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    reviews: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    availability: { type: DataTypes.STRING },
    image: { type: DataTypes.TEXT },
    normalUserOffer: { type: DataTypes.TEXT },
    vipUserOffer: { type: DataTypes.TEXT },
    phone: { type: DataTypes.STRING },
    gallery: { type: DataTypes.JSONB },
  }, {
    tableName: 'event_services',
    timestamps: true,
  });
}

async function run() {
  try {
    await source.authenticate();
    await target.authenticate();

    const SrcEvent = defineEventService(source);
    const DstEvent = defineEventService(target);

    // Ensure destination table exists
    await target.sync();

    const rows = await SrcEvent.findAll({ raw: true });
    if (!rows.length) {
      console.log('No rows found in source event_services');
      process.exit(0);
    }

    // Upsert to destination
    for (const row of rows) {
      await DstEvent.upsert(row);
    }

    console.log(`Migrated ${rows.length} rows to dm_app.event_services`);
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

run();


