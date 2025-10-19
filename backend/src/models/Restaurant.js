const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Restaurant = sequelize.define('Restaurant', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false
  },
  specialist: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  menu: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  discounts: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  actions: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  offers: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  photos: {
    type: DataTypes.JSONB,
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
  distance: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  openTime: {
    type: DataTypes.STRING,
    allowNull: false
  },
  area: {
    type: DataTypes.STRING,
    allowNull: false
  },
  priceForTwo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  opensIn: {
    type: DataTypes.STRING,
    allowNull: false
  },
  savePercent: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'restaurants',
  timestamps: false
});

module.exports = Restaurant;
