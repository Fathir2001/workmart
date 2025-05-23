const express = require('express');
const router = express.Router();
const ServiceProvider = require('../models/ServiceProvider');

// Public endpoint to get service providers with optional category filter
router.get('/service-providers', async (req, res) => {
  try {
    const { category } = req.query;
    
    const query = category
      ? { category: { $regex: `^${category}$`, $options: 'i' } }
      : {};
      
    const serviceProviders = await ServiceProvider.find(query);
    res.json(serviceProviders);
  } catch (err) {
    console.error('Error fetching service providers:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;