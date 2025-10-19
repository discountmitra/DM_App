const express = require('express');
const router = express.Router();
const Faq = require('../models/Faq');

// GET /faq - Get all FAQs
router.get('/', async (req, res) => {
  try {
    const faqs = await Faq.findAll({
      order: [['category', 'ASC'], ['id', 'ASC']],
    });
    res.json(faqs);
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    res.status(500).json({ error: 'Failed to fetch FAQs' });
  }
});

// GET /faq/:category - Get FAQs by category
router.get('/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const faqs = await Faq.findAll({
      where: { category },
      order: [['id', 'ASC']],
    });
    res.json(faqs);
  } catch (error) {
    console.error('Error fetching FAQs by category:', error);
    res.status(500).json({ error: 'Failed to fetch FAQs' });
  }
});

// GET /faq/:category/:id - Get specific FAQ by ID
router.get('/:category/:id', async (req, res) => {
  try {
    const { category, id } = req.params;
    const faq = await Faq.findOne({
      where: { id, category },
    });
    
    if (!faq) {
      return res.status(404).json({ error: 'FAQ not found' });
    }
    
    res.json(faq);
  } catch (error) {
    console.error('Error fetching FAQ:', error);
    res.status(500).json({ error: 'Failed to fetch FAQ' });
  }
});

module.exports = router;
