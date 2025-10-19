const express = require('express');
const { HealthcareProvider } = require('../models/HealthcareProvider');
const router = express.Router();

// Get all providers
router.get('/', async (req, res) => {
  try {
    const providers = await HealthcareProvider.findAll();
    res.json(providers);
  } catch (error) {
    console.error('Error fetching healthcare providers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get one by id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const provider = await HealthcareProvider.findByPk(id);
    if (!provider) return res.status(404).json({ error: 'Healthcare provider not found' });
    res.json(provider);
  } catch (error) {
    console.error('Error fetching healthcare provider:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;


