const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sequelize } = require('../db');
const Otp = require('../models/Otp');

const router = express.Router();

function signToken(user) {
  const payload = { id: user.id, phone: user.phone, name: user.name, isVip: user.isVip };
  return jwt.sign(payload, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '30d' });
}

// Registration - create user
router.post('/register', async (req, res) => {
  try {
    const { name, phone, email } = req.body || {};
    if (!name || !phone) return res.status(400).json({ error: 'name and phone required' });

    await sequelize.sync();
    const [user] = await User.findOrCreate({ where: { phone }, defaults: { name, phone, email } });
    if (email && !user.email) { user.email = email; await user.save(); }
    const token = signToken(user);
    res.json({ token, user });
  } catch (e) {
    console.error('register error', e);
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
    const user = await User.findByPk(payload.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;