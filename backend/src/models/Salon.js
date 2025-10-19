const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Salon = sequelize.define('Salon', {
  id: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.ENUM('men','women','unisex'), allowNull: false },
  rating: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
  reviews: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  image: { type: DataTypes.STRING, allowNull: true },
  phone: { type: DataTypes.STRING, allowNull: true },
  services: { type: DataTypes.JSONB, allowNull: true }
}, {
  tableName: 'salons',
  timestamps: false
});

module.exports = Salon;


