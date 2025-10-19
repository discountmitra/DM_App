const { Sequelize } = require('sequelize');

const DB_NAME = process.env.PGDATABASE ;
const DB_USER = process.env.PGUSER ;
const DB_PASS = process.env.PGPASSWORD ;
const DB_HOST = process.env.PGHOST ;
const DB_PORT = process.env.PGPORT ;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'postgres',
  logging: false,
});

module.exports = { sequelize };


