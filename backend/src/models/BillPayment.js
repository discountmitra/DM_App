const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const BillPayment = sequelize.define('BillPayment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    userType: {
      type: DataTypes.ENUM('normal', 'vip'),
      allowNull: false,
      defaultValue: 'normal'
    },
    category: {
      type: DataTypes.ENUM('food', 'shopping'),
      allowNull: false
    },
    merchantName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    billAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    discountPercentage: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    discountAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    finalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'completed', 'failed'),
      allowNull: false,
      defaultValue: 'completed'
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'static'
    },
    transactionId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    paymentDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'bill_payments',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  });

module.exports = BillPayment;
