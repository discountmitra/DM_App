const express = require('express');
const ConstructionService = require('../models/ConstructionService');

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const items = await ConstructionService.findAll({ order: [['name', 'ASC']] });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch construction services' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await ConstructionService.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch construction service' });
  }
});

module.exports = router;


