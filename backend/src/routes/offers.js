const express = require('express');
const Offer = require('../models/Offer');
const router = express.Router();

// Get all offers
router.get('/', async (req, res) => {
  try {
    const offers = await Offer.findAll({
      where: { isActive: true },
      order: [['category', 'ASC'], ['serviceType', 'ASC'], ['userType', 'ASC'], ['displayOrder', 'ASC']]
    });
    res.json(offers);
  } catch (error) {
    console.error('Error fetching offers:', error);
    res.status(500).json({ error: 'Failed to fetch offers' });
  }
});

// Get offers by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const offers = await Offer.findAll({
      where: { 
        category: category,
        isActive: true 
      },
      order: [['serviceType', 'ASC'], ['userType', 'ASC'], ['displayOrder', 'ASC']]
    });
    res.json(offers);
  } catch (error) {
    console.error('Error fetching offers by category:', error);
    res.status(500).json({ error: 'Failed to fetch offers by category' });
  }
});

// Get offers by category and service type
router.get('/category/:category/service/:serviceType', async (req, res) => {
  try {
    const { category, serviceType } = req.params;
    const offers = await Offer.findAll({
      where: { 
        category: category,
        serviceType: serviceType,
        isActive: true 
      },
      order: [['userType', 'ASC'], ['displayOrder', 'ASC']]
    });
    res.json(offers);
  } catch (error) {
    console.error('Error fetching offers by category and service:', error);
    res.status(500).json({ error: 'Failed to fetch offers by category and service' });
  }
});

// Get offers formatted for OfferCards component
router.get('/formatted/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { serviceType } = req.query;
    
    let whereClause = { 
      category: category,
      isActive: true 
    };
    
    if (serviceType) {
      whereClause.serviceType = serviceType;
    }
    
    const offers = await Offer.findAll({
      where: whereClause,
      order: [['serviceType', 'ASC'], ['userType', 'ASC'], ['displayOrder', 'ASC']]
    });
    
    // Format the data for OfferCards component
    const formattedOffers = {};
    
    offers.forEach(offer => {
      const key = offer.serviceType || 'default';
      if (!formattedOffers[key]) {
        formattedOffers[key] = { normal: [], vip: [] };
      }
      
      if (offer.userType === 'normal') {
        formattedOffers[key].normal.push(offer.offerText);
      } else {
        formattedOffers[key].vip.push(offer.offerText);
      }
    });
    
    // If no service-specific offers, create category-level offers
    if (Object.keys(formattedOffers).length === 0 || (serviceType && !formattedOffers[serviceType])) {
      const categoryOffers = await Offer.findAll({
        where: { 
          category: category,
          serviceType: null,
          isActive: true 
        },
        order: [['userType', 'ASC'], ['displayOrder', 'ASC']]
      });
      
      const categoryFormatted = { normal: [], vip: [] };
      categoryOffers.forEach(offer => {
        if (offer.userType === 'normal') {
          categoryFormatted.normal.push(offer.offerText);
        } else {
          categoryFormatted.vip.push(offer.offerText);
        }
      });
      
      if (serviceType) {
        formattedOffers[serviceType] = categoryFormatted;
      } else {
        formattedOffers.default = categoryFormatted;
      }
    }
    
    res.json(formattedOffers);
  } catch (error) {
    console.error('Error fetching formatted offers:', error);
    res.status(500).json({ error: 'Failed to fetch formatted offers' });
  }
});

module.exports = router;
