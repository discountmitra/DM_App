const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const HospitalOffer = sequelize.define('HospitalOffer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  serviceId: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Individual hospital/service ID (e.g., amrutha-children)'
  },
  serviceName: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Hospital or service name'
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: 'Service category like Hospitals, Diagnostics, etc.'
  },
  userType: {
    type: DataTypes.ENUM('normal', 'vip'),
    allowNull: false,
    comment: 'User type for the offer'
  },
  offerText: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'The actual offer description'
  },
  basePrice: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Original price before discounts'
  },
  normalPrice: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Price for normal users'
  },
  vipPrice: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Price for VIP users'
  },
  displayOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Order in which offers should be displayed'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'Whether the offer is currently active'
  }
}, {
  tableName: 'hospital_offers',
  timestamps: true,
  indexes: [
    {
      fields: ['serviceId', 'userType']
    },
    {
      fields: ['category', 'userType']
    },
    {
      fields: ['isActive']
    }
  ]
});

module.exports = HospitalOffer;

