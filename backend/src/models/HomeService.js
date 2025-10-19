const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const HomeService = sequelize.define('HomeService', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  icon: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.STRING,
    allowNull: false
  },
  discount: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rating: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  reviews: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  availability: {
    type: DataTypes.STRING,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  normalUserOffer: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  vipUserOffer: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'home_services',
  timestamps: false
});

module.exports = HomeService;
