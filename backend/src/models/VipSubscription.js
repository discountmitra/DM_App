const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const VipSubscription = sequelize.define('VipSubscription', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  planId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  planName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  amountPaid: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  originalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  discountApplied: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0
  },
  couponCode: {
    type: DataTypes.STRING,
    allowNull: true
  },
  subscriptionStart: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  subscriptionEnd: {
    type: DataTypes.DATE,
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  cancelledAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  cancellationReason: {
    type: DataTypes.STRING,
    allowNull: true
  },
  paymentMethod: {
    type: DataTypes.STRING,
    defaultValue: 'demo' // For now, since no payment integration
  },
  paymentStatus: {
    type: DataTypes.STRING,
    defaultValue: 'completed' // For demo purposes
  }
}, {
  tableName: 'vip_subscriptions',
  timestamps: true
});

module.exports = VipSubscription;
