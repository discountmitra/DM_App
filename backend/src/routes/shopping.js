const express = require('express');
const router = express.Router();
const ShoppingItem = require('../models/ShoppingItem');

// Get all shopping items
router.get('/', async (req, res) => {
  try {
    const shoppingItems = await ShoppingItem.findAll();
    res.json(shoppingItems);
  } catch (error) {
    console.error('Error fetching shopping items:', error);
    res.status(500).json({ error: 'Failed to fetch shopping items' });
  }
});

// Get shopping item by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const shoppingItem = await ShoppingItem.findByPk(id);
    
    if (!shoppingItem) {
      return res.status(404).json({ error: 'Shopping item not found' });
    }
    
    res.json(shoppingItem);
  } catch (error) {
    console.error('Error fetching shopping item:', error);
    res.status(500).json({ error: 'Failed to fetch shopping item' });
  }
});

module.exports = router;
