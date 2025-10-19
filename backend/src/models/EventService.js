const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const EventService = sequelize.define('EventService', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  icon: {
    type: DataTypes.STRING,
  },
  price: {
    type: DataTypes.STRING,
  },
  details: {
    type: DataTypes.TEXT,
  },
  capacity: {
    type: DataTypes.STRING,
  },
  location: {
    type: DataTypes.STRING,
  },
  rating: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  reviews: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  availability: {
    type: DataTypes.STRING,
  },
  image: {
    type: DataTypes.TEXT,
  },
  normalUserOffer: {
    type: DataTypes.TEXT,
  },
  vipUserOffer: {
    type: DataTypes.TEXT,
  },
  phone: {
    type: DataTypes.STRING,
  },
  gallery: {
    // store as JSON array of strings
    type: DataTypes.JSONB,
  },
}, {
  tableName: 'event_services',
  timestamps: true,
});

module.exports = EventService;


