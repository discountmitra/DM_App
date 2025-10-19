const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const HealthcareProvider = sequelize.define('HealthcareProvider', {
  id: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  location: { type: DataTypes.STRING, allowNull: false },
  bookingPay: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  bookingCashback: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  specialOffers: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
  phone: { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
  category: { type: DataTypes.STRING, allowNull: false },
  image: { type: DataTypes.STRING, allowNull: true },
}, {
  tableName: 'healthcare_providers',
  timestamps: false,
});

module.exports = { HealthcareProvider };


