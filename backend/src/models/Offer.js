const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Offer = sequelize.define('Offer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: 'Main category like hospital, home-service, event, etc.'
  },
  serviceType: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Specific service type like Hospitals, Diagnostics, etc.'
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
  tableName: 'offers',
  timestamps: true,
  indexes: [
    {
      fields: ['category', 'serviceType', 'userType']
    },
    {
      fields: ['category', 'userType']
    },
    {
      fields: ['isActive']
    }
  ]
});

module.exports = Offer;

