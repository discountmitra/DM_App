const { Sequelize } = require('sequelize');

// Support both connection string (Neon) and individual params (local)
let sequelize;

if (process.env.DATABASE_URL) {
  // Use connection string for Neon or other cloud databases
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false,
  });
} else {
  // Use individual parameters for local database
  const DB_NAME = process.env.PGDATABASE || process.env.NEON_PGDATABASE;
  const DB_USER = process.env.PGUSER || process.env.NEON_PGUSER;
  const DB_PASS = String(process.env.PGPASSWORD || process.env.NEON_PGPASSWORD || '');
  const DB_HOST = process.env.PGHOST || process.env.NEON_PGHOST;
  const DB_PORT = process.env.PGPORT || process.env.NEON_PGPORT;

  sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'postgres',
    logging: false,
  });
}

module.exports = { sequelize };


