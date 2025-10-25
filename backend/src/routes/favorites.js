const express = require('express');
const router = express.Router();
const UserFavorites = require('../models/UserFavorites');
const User = require('../models/User');

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const jwt = require('jsonwebtoken');
  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Add item to favorites
router.post('/add', authenticateToken, async (req, res) => {
  try {
    const {
      itemId,
      itemName,
      category,
      subcategory,
      image,
      description,
      price,
      rating,
      reviews,
      location,
      address,
      phone
    } = req.body;

    // Validate required fields
    if (!itemId || !itemName || !category) {
      return res.status(400).json({ 
        error: 'Missing required fields: itemId, itemName, category' 
      });
    }

    // Check if item is already in favorites
    const existingFavorite = await UserFavorites.findOne({
      where: {
        userId: req.user.id,
        itemId: itemId
      }
    });

    if (existingFavorite) {
      return res.status(400).json({ 
        error: 'Item is already in favorites' 
      });
    }

    // Create favorite record
    const favorite = await UserFavorites.create({
      userId: req.user.id,
      itemId,
      itemName,
      category,
      subcategory,
      image,
      description,
      price,
      rating,
      reviews,
      location,
      address,
      phone
    });

    res.status(201).json({
      success: true,
      message: 'Item added to favorites successfully',
      favorite: {
        id: favorite.id,
        itemId: favorite.itemId,
        itemName: favorite.itemName,
        category: favorite.category,
        addedAt: favorite.addedAt
      }
    });

  } catch (error) {
    console.error('Error adding to favorites:', error);
    res.status(500).json({ error: 'Failed to add item to favorites' });
  }
});

// Remove item from favorites
router.delete('/remove/:itemId', authenticateToken, async (req, res) => {
  try {
    const { itemId } = req.params;

    const favorite = await UserFavorites.findOne({
      where: {
        userId: req.user.id,
        itemId: itemId
      }
    });

    if (!favorite) {
      return res.status(404).json({ error: 'Item not found in favorites' });
    }

    await favorite.destroy();

    res.json({
      success: true,
      message: 'Item removed from favorites successfully'
    });

  } catch (error) {
    console.error('Error removing from favorites:', error);
    res.status(500).json({ error: 'Failed to remove item from favorites' });
  }
});

// Get user's favorites
router.get('/my-favorites', authenticateToken, async (req, res) => {
  try {
    const favorites = await UserFavorites.findAll({
      where: { userId: req.user.id },
      order: [['addedAt', 'DESC']]
    });

    res.json({
      success: true,
      favorites: favorites
    });

  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

// Check if item is in favorites
router.get('/check/:itemId', authenticateToken, async (req, res) => {
  try {
    const { itemId } = req.params;

    const favorite = await UserFavorites.findOne({
      where: {
        userId: req.user.id,
        itemId: itemId
      }
    });

    res.json({
      success: true,
      isFavorite: !!favorite
    });

  } catch (error) {
    console.error('Error checking favorite status:', error);
    res.status(500).json({ error: 'Failed to check favorite status' });
  }
});

// Get favorites by category
router.get('/category/:category', authenticateToken, async (req, res) => {
  try {
    const { category } = req.params;

    const favorites = await UserFavorites.findAll({
      where: { 
        userId: req.user.id,
        category: category
      },
      order: [['addedAt', 'DESC']]
    });

    res.json({
      success: true,
      favorites: favorites
    });

  } catch (error) {
    console.error('Error fetching favorites by category:', error);
    res.status(500).json({ error: 'Failed to fetch favorites by category' });
  }
});

// Clear all favorites
router.delete('/clear-all', authenticateToken, async (req, res) => {
  try {
    await UserFavorites.destroy({
      where: { userId: req.user.id }
    });

    res.json({
      success: true,
      message: 'All favorites cleared successfully'
    });

  } catch (error) {
    console.error('Error clearing favorites:', error);
    res.status(500).json({ error: 'Failed to clear favorites' });
  }
});

module.exports = router;
