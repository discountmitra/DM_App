const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const ConstructionService = sequelize.define('ConstructionService', {
  id: { type: DataTypes.STRING, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  category: { type: DataTypes.STRING, allowNull: false },
  icon: { type: DataTypes.STRING },
  price: { type: DataTypes.STRING },
  details: { type: DataTypes.TEXT },
  rating: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
  reviews: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  availability: { type: DataTypes.STRING },
  image: { type: DataTypes.TEXT },
  normalUserOffer: { type: DataTypes.TEXT },
  vipUserOffer: { type: DataTypes.TEXT },
  phone: { type: DataTypes.STRING },
  // Optional gallery (only for some items like Interior Design)
  gallery: { type: DataTypes.JSONB },
}, {
  tableName: 'construction_services',
  timestamps: true,
});

module.exports = ConstructionService;


