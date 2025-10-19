const express = require('express');
const router = express.Router();
const Salon = require('../models/Salon');

router.get('/', async (_req, res) => {
  try {
    const salons = await Salon.findAll();
    res.json(salons);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch salons' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const salon = await Salon.findByPk(req.params.id);
    if (!salon) return res.status(404).json({ error: 'Not found' });
    res.json(salon);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch salon' });
  }
});

module.exports = router;


