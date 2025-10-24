const express = require('express');
const router = express.Router();
const { sequelize } = require('../db');
const BillPayment = require('../models/BillPayment');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

// Create a new bill payment
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const {
      category,
      merchantName,
      billAmount,
      discountPercentage,
      discountAmount,
      finalAmount,
      paymentMethod = 'static',
      notes
    } = req.body;

    // Validate required fields
    if (!category || !merchantName || !billAmount || !finalAmount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: category, merchantName, billAmount, finalAmount'
      });
    }

    // Validate category
    if (!['food', 'shopping'].includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category. Must be either "food" or "shopping"'
      });
    }

    // Get user details
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate transaction ID
    const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create bill payment record
    const billPayment = await BillPayment.create({
      userId: req.user.id,
      userType: user.isVip ? 'vip' : 'normal',
      category,
      merchantName,
      billAmount: parseFloat(billAmount),
      discountPercentage: parseInt(discountPercentage) || 0,
      discountAmount: parseFloat(discountAmount) || 0,
      finalAmount: parseFloat(finalAmount),
      paymentStatus: 'completed',
      paymentMethod,
      transactionId,
      notes
    });

    res.status(201).json({
      success: true,
      message: 'Bill payment recorded successfully',
      data: {
        id: billPayment.id,
        transactionId: billPayment.transactionId,
        category: billPayment.category,
        merchantName: billPayment.merchantName,
        billAmount: billPayment.billAmount,
        discountAmount: billPayment.discountAmount,
        finalAmount: billPayment.finalAmount,
        paymentStatus: billPayment.paymentStatus,
        paymentDate: billPayment.paymentDate
      }
    });

  } catch (error) {
    console.error('Error creating bill payment:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get user's bill payment history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, category } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = { userId: req.user.id };
    if (category && ['food', 'shopping'].includes(category)) {
      whereClause.category = category;
    }

    const { count, rows } = await BillPayment.findAndCountAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      attributes: [
        'id', 'category', 'merchantName', 'billAmount', 
        'discountAmount', 'finalAmount', 'paymentStatus', 
        'transactionId', 'paymentDate', 'createdAt'
      ]
    });

    res.json({
      success: true,
      data: {
        payments: rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching bill payment history:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get specific bill payment details
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const billPayment = await BillPayment.findOne({
      where: {
        id: id,
        userId: req.user.id
      },
      attributes: [
        'id', 'category', 'merchantName', 'billAmount', 
        'discountPercentage', 'discountAmount', 'finalAmount', 
        'paymentStatus', 'paymentMethod', 'transactionId', 
        'paymentDate', 'notes', 'createdAt', 'updatedAt'
      ]
    });

    if (!billPayment) {
      return res.status(404).json({
        success: false,
        message: 'Bill payment not found'
      });
    }

    res.json({
      success: true,
      data: billPayment
    });

  } catch (error) {
    console.error('Error fetching bill payment details:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get payment statistics for user
router.get('/stats/summary', authenticateToken, async (req, res) => {
  try {
    const { category } = req.query;
    
    const whereClause = { userId: req.user.id };
    if (category && ['food', 'shopping'].includes(category)) {
      whereClause.category = category;
    }

    const stats = await BillPayment.findAll({
      where: whereClause,
      attributes: [
        'category',
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalPayments'],
        [sequelize.fn('SUM', sequelize.col('billAmount')), 'totalBillAmount'],
        [sequelize.fn('SUM', sequelize.col('discountAmount')), 'totalSavings'],
        [sequelize.fn('SUM', sequelize.col('finalAmount')), 'totalPaid']
      ],
      group: ['category'],
      raw: true
    });

    res.json({
      success: true,
      data: {
        categoryStats: stats,
        overallStats: {
          totalPayments: stats.reduce((sum, stat) => sum + parseInt(stat.totalPayments), 0),
          totalBillAmount: stats.reduce((sum, stat) => sum + parseFloat(stat.totalBillAmount || 0), 0),
          totalSavings: stats.reduce((sum, stat) => sum + parseFloat(stat.totalSavings || 0), 0),
          totalPaid: stats.reduce((sum, stat) => sum + parseFloat(stat.totalPaid || 0), 0)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching payment statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

module.exports = router;
