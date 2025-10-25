const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const UserFavorites = sequelize.define('UserFavorites', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'ID of the user who added the favorite'
  },
  itemId: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'ID of the favorited item'
  },
  itemName: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Name of the favorited item'
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Main category (Healthcare, Food, etc.)'
  },
  subcategory: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Sub-category (Hospital, Restaurant, etc.)'
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Image URL of the item'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Description of the item'
  },
  price: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Price information'
  },
  rating: {
    type: DataTypes.DECIMAL(3, 1),
    allowNull: true,
    comment: 'Rating of the item'
  },
  reviews: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Number of reviews'
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Location of the item'
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Address of the item'
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Phone number of the item'
  },
  addedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: 'When the item was added to favorites'
  }
}, {
  tableName: 'user_favorites',
  timestamps: true,
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['itemId']
    },
    {
      fields: ['category']
    },
    {
      fields: ['addedAt']
    },
    {
      unique: true,
      fields: ['userId', 'itemId'],
      name: 'unique_user_item_favorite'
    }
  ]
});

module.exports = UserFavorites;
