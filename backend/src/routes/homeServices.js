const express = require('express');
const router = express.Router();
const HomeService = require('../models/HomeService');

// GET /home-services - Get all home services
router.get('/', async (req, res) => {
  try {
    const services = await HomeService.findAll();
    res.json(services);
  } catch (error) {
    console.error('Error fetching home services:', error);
    res.status(500).json({ error: 'Failed to fetch home services' });
  }
});

// GET /home-services/:id - Get a specific home service by ID
router.get('/:id', async (req, res) => {
  try {
    const service = await HomeService.findByPk(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Home service not found' });
    }
    res.json(service);
  } catch (error) {
    console.error('Error fetching home service:', error);
    res.status(500).json({ error: 'Failed to fetch home service' });
  }
});

module.exports = router;
