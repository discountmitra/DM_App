const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const BookingData = sequelize.define('BookingData', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'ID of the user who made the booking'
  },
  userType: {
    type: DataTypes.ENUM('normal', 'vip'),
    allowNull: false,
    comment: 'Type of user (normal or VIP)'
  },
  orderId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    unique: true,
    comment: 'Unique order ID for the booking'
  },
  orderData: {
    type: DataTypes.JSONB,
    allowNull: false,
    comment: 'All form data entered by user during booking'
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
    allowNull: false,
    defaultValue: 'completed',
    comment: 'Payment status (static for now)'
  },
  amountPaid: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Amount paid for the booking'
  },
  bookingDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: 'Date and time of booking'
  },
  requestId: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Request ID shown in confirmation modal'
  },
  serviceId: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'ID of the service being booked'
  },
  serviceName: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Name of the service being booked'
  },
  serviceCategory: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Category of the service (e.g., home-services)'
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled'),
    allowNull: false,
    defaultValue: 'pending',
    comment: 'Current status of the booking'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Additional notes or special requirements'
  }
}, {
  tableName: 'booking_data',
  timestamps: true,
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['orderId']
    },
    {
      fields: ['requestId']
    },
    {
      fields: ['serviceId']
    },
    {
      fields: ['bookingDate']
    },
    {
      fields: ['status']
    }
  ]
});

module.exports = BookingData;
