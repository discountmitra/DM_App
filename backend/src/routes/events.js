const express = require('express');
const EventService = require('../models/EventService');

const router = express.Router();

// GET /events - list all
router.get('/', async (_req, res) => {
  try {
    const items = await EventService.findAll({ order: [['name', 'ASC']] });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// GET /events/:id - single by id
router.get('/:id', async (req, res) => {
  try {
    const item = await EventService.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

module.exports = router;


