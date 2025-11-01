const express = require('express');
const HospitalOffer = require('../models/HospitalOffer');
const router = express.Router();

// Get all hospital offers
router.get('/', async (req, res) => {
  try {
    const offers = await HospitalOffer.findAll({
      where: { isActive: true },
      order: [['serviceId', 'ASC'], ['userType', 'ASC'], ['displayOrder', 'ASC']]
    });
    res.json(offers);
  } catch (error) {
    console.error('Error fetching hospital offers:', error);
    res.status(500).json({ error: 'Failed to fetch hospital offers' });
  }
});

// Get offers by serviceId
router.get('/service/:serviceId', async (req, res) => {
  try {
    const { serviceId } = req.params;
    const offers = await HospitalOffer.findAll({
      where: { 
        serviceId: serviceId,
        isActive: true 
      },
      order: [['userType', 'ASC'], ['displayOrder', 'ASC']]
    });
    res.json(offers);
  } catch (error) {
    console.error('Error fetching hospital offers by service:', error);
    res.status(500).json({ error: 'Failed to fetch hospital offers by service' });
  }
});

// Get offers formatted for OfferCards component
router.get('/formatted/service/:serviceId', async (req, res) => {
  try {
    const { serviceId } = req.params;
    
    const offers = await HospitalOffer.findAll({
      where: { 
        serviceId: serviceId,
        isActive: true 
      },
      order: [['userType', 'ASC'], ['displayOrder', 'ASC']]
    });
    
    // Format the data for OfferCards component
    const formattedOffers = {
      normal: [],
      vip: []
    };
    
    offers.forEach(offer => {
      if (offer.userType === 'normal') {
        formattedOffers.normal.push(offer.offerText);
      } else {
        formattedOffers.vip.push(offer.offerText);
      }
    });
    
    res.json(formattedOffers);
  } catch (error) {
    console.error('Error fetching formatted hospital offers:', error);
    res.status(500).json({ error: 'Failed to fetch formatted hospital offers' });
  }
});

// Get pricing for a specific service
router.get('/pricing/:serviceId', async (req, res) => {
  try {
    const { serviceId } = req.params;
    
    const offer = await HospitalOffer.findOne({
      where: { 
        serviceId: serviceId,
        userType: 'normal', // Get pricing from normal user type
        isActive: true 
      },
      order: [['displayOrder', 'ASC']]
    });
    
    if (!offer) {
      return res.status(404).json({ error: 'Service pricing not found' });
    }
    
    const vipOffer = await HospitalOffer.findOne({
      where: { 
        serviceId: serviceId,
        userType: 'vip',
        isActive: true 
      },
      order: [['displayOrder', 'ASC']]
    });
    
    res.json({
      basePrice: offer.basePrice,
      normalPrice: offer.normalPrice,
      vipPrice: vipOffer ? vipOffer.vipPrice : 0
    });
  } catch (error) {
    console.error('Error fetching service pricing:', error);
    res.status(500).json({ error: 'Failed to fetch service pricing' });
  }
});

module.exports = router;

