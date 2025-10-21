const express = require('express');
const router = express.Router();
const BookingData = require('../models/BookingData');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const jwt = require('jsonwebtoken');
  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Create a new booking
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const {
      orderData,
      serviceId,
      serviceName,
      serviceCategory,
      requestId,
      notes
    } = req.body;

    // Validate required fields
    if (!orderData || !serviceId || !serviceName || !serviceCategory || !requestId) {
      return res.status(400).json({ 
        error: 'Missing required fields: orderData, serviceId, serviceName, serviceCategory, requestId' 
      });
    }

    // Get user details
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Determine user type and booking amount
    const userType = user.isVip ? 'vip' : 'normal';
    const amountPaid = userType === 'vip' ? 0 : 9; // VIP users get free booking, normal users pay ₹9

    // Create booking record
    const booking = await BookingData.create({
      userId: user.id,
      userType: userType,
      orderId: uuidv4(),
      orderData: orderData,
      paymentStatus: 'completed', // Static for now
      amountPaid: amountPaid,
      requestId: requestId,
      serviceId: serviceId,
      serviceName: serviceName,
      serviceCategory: serviceCategory,
      status: 'pending',
      notes: notes || null
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking: {
        id: booking.id,
        orderId: booking.orderId,
        requestId: booking.requestId,
        amountPaid: booking.amountPaid,
        userType: booking.userType,
        status: booking.status,
        bookingDate: booking.bookingDate
      }
    });

  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Get user's bookings
router.get('/my-bookings', authenticateToken, async (req, res) => {
  try {
    const bookings = await BookingData.findAll({
      where: { userId: req.user.id },
      order: [['bookingDate', 'DESC']]
    });

    res.json({
      success: true,
      bookings: bookings
    });

  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Get booking by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const booking = await BookingData.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id // Ensure user can only access their own bookings
      }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({
      success: true,
      booking: booking
    });

  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// Update booking status (for admin use later)
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const booking = await BookingData.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    await booking.update({ status });

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      booking: {
        id: booking.id,
        status: booking.status
      }
    });

  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ error: 'Failed to update booking status' });
  }
});

module.exports = router;
