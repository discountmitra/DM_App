const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sequelize } = require('../db');
const Otp = require('../models/Otp');
const { generateUniqueUserId } = require('../utils/userIdGenerator');

const router = express.Router();

function signToken(user) {
  // Always use newId if available, otherwise fallback to id
  const userId = user.newId || user.id;
  const payload = { id: userId, phone: user.phone, name: user.name, isVip: user.isVip };
  return jwt.sign(payload, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '30d' });
}

// Registration - create user
router.post('/register', async (req, res) => {
  try {
    const { name, phone, email } = req.body || {};
    if (!name || !phone) return res.status(400).json({ error: 'name and phone required' });

    await sequelize.sync();
    
    // Check if user already exists by phone first
    let user = await User.findOne({ where: { phone } });
    
    if (user) {
      // User exists with this phone, update information if needed
      let updated = false;
      
      if (email && !user.email) { 
        user.email = email; 
        updated = true;
      }
      
      if (name && user.name !== name) {
        user.name = name;
        updated = true;
      }
      
      if (updated) {
        await user.save();
      }
    } else {
      // Check if email already exists (if provided)
      if (email) {
        const existingEmailUser = await User.findOne({ where: { email } });
        if (existingEmailUser) {
          return res.status(400).json({ error: 'Email already exists' });
        }
      }
      
      // Create new user with alphanumeric ID
      const userId = await generateUniqueUserId(User);
      user = await User.create({ 
        newId: userId, 
        name, 
        phone, 
        email 
      });
      
      // Refresh user to ensure we have the latest data
      user = await User.findOne({
        where: { id: user.id },
        attributes: ['id', 'newId', 'name', 'phone', 'email', 'isVip', 'vipExpiresAt', 'currentSubscriptionId']
      });
      
      // If newId is still null, try to get it directly from the database
      if (!user.newId) {
        const rawUser = await sequelize.query(
          'SELECT id, new_id, name, phone, email, "isVip", "vipExpiresAt", "currentSubscriptionId" FROM users WHERE id = ?',
          { 
            replacements: [user.id], 
            type: sequelize.QueryTypes.SELECT 
          }
        );
        if (rawUser.length > 0) {
          user.newId = rawUser[0].new_id;
        }
      }
    }
    
    const token = signToken(user);
    
    // Return user with newId as id for frontend compatibility
    const userResponse = {
      id: user.newId || user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      isVip: user.isVip,
      vipExpiresAt: user.vipExpiresAt,
      currentSubscriptionId: user.currentSubscriptionId
    };
    
    res.json({ token, user: userResponse });
  } catch (e) {
    console.error('register error', e);
    
    // Handle specific error cases
    if (e.name === 'SequelizeUniqueConstraintError') {
      if (e.errors.some(err => err.path === 'email')) {
        return res.status(400).json({ error: 'Email already exists' });
      }
      if (e.errors.some(err => err.path === 'phone')) {
        return res.status(400).json({ error: 'Phone number already exists' });
      }
    }
    
    res.status(500).json({ error: 'Failed to register' });
  }
});

// OTP: request (send)
router.post('/otp/request', async (req, res) => {
  try {
    const { phone } = req.body || {};
    if (!phone) return res.status(400).json({ error: 'phone required' });
    const user = await User.findOne({ where: { phone } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Generate 4-digit OTP and persist
    const code = String(Math.floor(1000 + Math.random() * 9000));
    const ttlMs = 5 * 60 * 1000; // 5 min
    const expiresAt = new Date(Date.now() + ttlMs);
    await sequelize.sync();
    await Otp.create({ phone, code, expiresAt });

    // Send via Twilio
    const sid = process.env.TWILIO_ACCOUNT_SID;
    const auth = process.env.TWILIO_AUTH_TOKEN;
    const from = process.env.TWILIO_PHONE_NUMBER;
    if (!sid || !auth || !from) return res.status(500).json({ error: 'Twilio not configured' });
    const twilio = require('twilio')(sid, auth);
    await twilio.messages.create({ from, to: phone, body: `Your DiscountMitra code is ${code}` });

    res.json({ ok: true });
  } catch (e) {
    console.error('otp request error', e);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// OTP: verify (login)
router.post('/otp/verify', async (req, res) => {
  try {
    const { phone, code } = req.body || {};
    if (!phone || !code) return res.status(400).json({ error: 'phone and code required' });
    const user = await User.findOne({ where: { phone } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const record = await Otp.findOne({ where: { phone }, order: [['createdAt', 'DESC']] });
    if (!record) return res.status(400).json({ error: 'OTP not requested' });
    if (record.consumedAt) return res.status(400).json({ error: 'OTP already used' });
    if (new Date() > new Date(record.expiresAt)) return res.status(400).json({ error: 'OTP expired' });
    if (String(record.code) !== String(code)) return res.status(400).json({ error: 'Invalid OTP' });

    record.consumedAt = new Date();
    await record.save();
    const token = signToken(user);
    res.json({ token, user });
  } catch (e) {
    console.error('otp verify error', e);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
});

// Me: verify token
router.get('/me', async (req, res) => {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'No token' });
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    
    // Try to find user by newId first, then fallback to id
    let user = await User.findOne({ where: { newId: payload.id } });
    if (!user) {
      user = await User.findByPk(payload.id);
    }
    
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    // Return user with newId as id for frontend compatibility
    const userResponse = {
      id: user.newId || user.id, // Prioritize newId
      name: user.name,
      phone: user.phone,
      email: user.email,
      isVip: user.isVip,
      vipExpiresAt: user.vipExpiresAt,
      currentSubscriptionId: user.currentSubscriptionId
    };
    
    res.json({ user: userResponse });
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;