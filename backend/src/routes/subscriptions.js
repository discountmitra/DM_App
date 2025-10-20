const express = require('express');
const router = express.Router();
const User = require('../models/User');
const VipSubscription = require('../models/VipSubscription');
const { sequelize } = require('../db');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Get user's current subscription status
router.get('/status', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let currentSubscription = null;
    if (user.currentSubscriptionId) {
      currentSubscription = await VipSubscription.findByPk(user.currentSubscriptionId);
    }

    res.json({
      isVip: user.isVip,
      vipExpiresAt: user.vipExpiresAt,
      currentSubscription: currentSubscription ? {
        id: currentSubscription.id,
        planName: currentSubscription.planName,
        amountPaid: currentSubscription.amountPaid,
        subscriptionStart: currentSubscription.subscriptionStart,
        subscriptionEnd: currentSubscription.subscriptionEnd,
        isActive: currentSubscription.isActive
      } : null
    });
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    res.status(500).json({ error: 'Failed to fetch subscription status' });
  }
});

// Purchase subscription
router.post('/purchase', authenticateToken, async (req, res) => {
  try {
    const { planId, planName, amountPaid, originalPrice, discountApplied, couponCode } = req.body;
    
    if (!planId || !planName || !amountPaid) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate subscription end date based on plan
    const now = new Date();
    let subscriptionEnd;
    switch (planId) {
      case 'monthly':
        subscriptionEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        break;
      case 'halfyearly':
        subscriptionEnd = new Date(now.getTime() + 182 * 24 * 60 * 60 * 1000); // approx 6 months
        break;
      case 'yearly':
        subscriptionEnd = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        return res.status(400).json({ error: 'Invalid plan ID' });
    }

    // Create subscription record
    const subscription = await VipSubscription.create({
      userId: user.id,
      planId,
      planName,
      amountPaid,
      originalPrice: originalPrice || amountPaid,
      discountApplied: discountApplied || 0,
      couponCode: couponCode || null,
      subscriptionStart: now,
      subscriptionEnd,
      isActive: true,
      paymentMethod: 'demo',
      paymentStatus: 'completed'
    });

    // Update user VIP status
    await user.update({
      isVip: true,
      vipExpiresAt: subscriptionEnd,
      currentSubscriptionId: subscription.id
    });

    res.json({
      success: true,
      subscription: {
        id: subscription.id,
        planName: subscription.planName,
        amountPaid: subscription.amountPaid,
        subscriptionStart: subscription.subscriptionStart,
        subscriptionEnd: subscription.subscriptionEnd
      }
    });
  } catch (error) {
    console.error('Error purchasing subscription:', error);
    res.status(500).json({ error: 'Failed to purchase subscription' });
  }
});

// Cancel subscription
router.post('/cancel', authenticateToken, async (req, res) => {
  try {
    const { reason } = req.body;
    
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.currentSubscriptionId) {
      return res.status(400).json({ error: 'No active subscription to cancel' });
    }

    const subscription = await VipSubscription.findByPk(user.currentSubscriptionId);
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    // Update subscription as cancelled
    await subscription.update({
      isActive: false,
      cancelledAt: new Date(),
      cancellationReason: reason || 'User requested cancellation'
    });

    // Update user VIP status
    await user.update({
      isVip: false,
      vipExpiresAt: null,
      currentSubscriptionId: null
    });

    res.json({ success: true, message: 'Subscription cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

// Check and update expired subscriptions (cron job endpoint)
router.post('/check-expired', async (req, res) => {
  try {
    const now = new Date();
    
    // Find users with expired VIP status
    const expiredUsers = await User.findAll({
      where: {
        isVip: true,
        vipExpiresAt: {
          [sequelize.Op.lt]: now
        }
      }
    });

    let updatedCount = 0;
    for (const user of expiredUsers) {
      // Update user VIP status
      await user.update({
        isVip: false,
        vipExpiresAt: null,
        currentSubscriptionId: null
      });

      // Update subscription as expired
      if (user.currentSubscriptionId) {
        await VipSubscription.update(
          { 
            isActive: false,
            cancellationReason: 'Subscription expired'
          },
          { where: { id: user.currentSubscriptionId } }
        );
      }

      updatedCount++;
    }

    res.json({ 
      success: true, 
      message: `Updated ${updatedCount} expired subscriptions` 
    });
  } catch (error) {
    console.error('Error checking expired subscriptions:', error);
    res.status(500).json({ error: 'Failed to check expired subscriptions' });
  }
});

// Get subscription history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const subscriptions = await VipSubscription.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    res.json({ subscriptions });
  } catch (error) {
    console.error('Error fetching subscription history:', error);
    res.status(500).json({ error: 'Failed to fetch subscription history' });
  }
});

module.exports = router;
