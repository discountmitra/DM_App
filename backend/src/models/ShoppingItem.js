const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const ShoppingItem = sequelize.define('ShoppingItem', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  specialist: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'shopping_items',
  timestamps: false
});

module.exports = ShoppingItem;
