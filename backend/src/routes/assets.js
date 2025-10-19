const express = require('express');
const router = express.Router();
const Asset = require('../models/Asset');

// GET /assets - Get all assets
router.get('/', async (req, res) => {
  try {
    const assets = await Asset.findAll({
      order: [['type', 'ASC'], ['id', 'ASC']],
    });
    res.json(assets);
  } catch (error) {
    console.error('Error fetching assets:', error);
    res.status(500).json({ error: 'Failed to fetch assets' });
  }
});

// GET /assets/type/:type - Get assets by type
router.get('/type/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const assets = await Asset.findAll({
      where: { type },
      order: [['id', 'ASC']],
    });
    res.json(assets);
  } catch (error) {
    console.error('Error fetching assets by type:', error);
    res.status(500).json({ error: 'Failed to fetch assets' });
  }
});

// GET /assets/deals - Get all deals
router.get('/deals', async (req, res) => {
  try {
    const deals = await Asset.findAll({
      where: { type: 'deal' },
      order: [['id', 'ASC']],
    });
    res.json(deals);
  } catch (error) {
    console.error('Error fetching deals:', error);
    res.status(500).json({ error: 'Failed to fetch deals' });
  }
});

// GET /assets/home-images - Get all home images
router.get('/home-images', async (req, res) => {
  try {
    const homeImages = await Asset.findAll({
      where: { type: 'home_image' },
      order: [['id', 'ASC']],
    });
    res.json(homeImages);
  } catch (error) {
    console.error('Error fetching home images:', error);
    res.status(500).json({ error: 'Failed to fetch home images' });
  }
});

// GET /assets/:id - Get specific asset by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const asset = await Asset.findByPk(id);
    
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    
    res.json(asset);
  } catch (error) {
    console.error('Error fetching asset:', error);
    res.status(500).json({ error: 'Failed to fetch asset' });
  }
});

module.exports = router;
