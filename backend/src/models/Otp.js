const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Otp = sequelize.define('Otp', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  phone: { type: DataTypes.STRING(20), allowNull: false, index: true },
  code: { type: DataTypes.STRING(10), allowNull: false },
  expiresAt: { type: DataTypes.DATE, allowNull: false },
  consumedAt: { type: DataTypes.DATE, allowNull: true },
}, {
  tableName: 'otps',
  timestamps: true,
  indexes: [{ fields: ['phone', 'expiresAt'] }]
});

module.exports = Otp;