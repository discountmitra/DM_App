const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Asset = sequelize.define('Asset', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Type of asset (deal, home_image, vip_banner, logo, etc.)',
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Image URL or path',
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'assets',
  timestamps: true,
});

module.exports = Asset;
