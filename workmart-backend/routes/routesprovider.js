const express = require('express');
const router = express.Router();
const ServiceProvider = require('../models/ServiceProvider');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

// Get all service providers (admin only)
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const serviceProviders = await ServiceProvider.find();
    res.json(serviceProviders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new service provider (admin only)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  const { name, profilePic, category, location } = req.body;

  try {
    const serviceProvider = new ServiceProvider({
      name,
      profilePic,
      category,
      location,
    });

    const newServiceProvider = await serviceProvider.save();
    res.status(201).json(newServiceProvider);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a service provider (admin only)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const serviceProvider = await ServiceProvider.findById(req.params.id);
    if (!serviceProvider) {
      return res.status(404).json({ message: 'Service provider not found' });
    }

    serviceProvider.name = req.body.name || serviceProvider.name;
    serviceProvider.profilePic = req.body.profilePic || serviceProvider.profilePic;
    serviceProvider.category = req.body.category || serviceProvider.category;
    serviceProvider.location = req.body.location || serviceProvider.location;

    const updatedServiceProvider = await serviceProvider.save();
    res.json(updatedServiceProvider);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a service provider (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const serviceProvider = await ServiceProvider.findById(req.params.id);
    if (!serviceProvider) {
      return res.status(404).json({ message: 'Service provider not found' });
    }

    await serviceProvider.deleteOne();
    res.json({ message: 'Service provider deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;