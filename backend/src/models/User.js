const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const User = sequelize.define('User', {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true,
    comment: 'Legacy integer ID (for foreign key compatibility)'
  },
  newId: { 
    type: DataTypes.STRING(7), 
    allowNull: false,
    unique: true,
    field: 'new_id',
    comment: 'Alphanumeric user ID (6-7 characters)'
  },
  name: { type: DataTypes.STRING(120), allowNull: false },
  phone: { type: DataTypes.STRING(20), allowNull: false, unique: true },
  email: { type: DataTypes.STRING(160), allowNull: true, unique: true },
  isVip: { type: DataTypes.BOOLEAN, defaultValue: false },
  vipExpiresAt: { type: DataTypes.DATE, allowNull: true },
  currentSubscriptionId: { type: DataTypes.INTEGER, allowNull: true },
}, {
  tableName: 'users',
  timestamps: true,
  indexes: [
    { fields: ['phone'], unique: true },
    { fields: ['new_id'], unique: true }
  ]
});

module.exports = User;