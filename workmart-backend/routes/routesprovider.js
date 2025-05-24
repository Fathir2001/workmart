const express = require('express');
const router = express.Router();
const ServiceProvider = require('../models/ServiceProvider');
// Fix the middleware import
const { auth, verifyAdmin } = require('../middleware/auth');

// Get all service providers (admin only)
router.get('/', auth, verifyAdmin, async (req, res) => {
  try {
    const serviceProviders = await ServiceProvider.find();
    res.json(serviceProviders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new service provider (admin only)
router.post('/', auth, verifyAdmin, async (req, res) => {
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
router.put('/:id', auth, verifyAdmin, async (req, res) => {
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
router.delete('/:id', auth, verifyAdmin, async (req, res) => {
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

// Add a rating for a service provider (make public - no auth required)
router.post('/:id/rate', async (req, res) => {
  try {
    const { rating, userId } = req.body;
    
    // Add debugging
    console.log(`Received rating request for provider: ${req.params.id}`);
    console.log('Rating value:', rating);
    console.log('User ID:', userId || 'anonymous');
    
    const serviceProvider = await ServiceProvider.findById(req.params.id);
    
    if (!serviceProvider) {
      console.log(`Provider not found with ID: ${req.params.id}`);
      return res.status(404).json({ message: 'Service provider not found' });
    }

    // Validate rating value
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Generate a unique ID for anonymous users or use the provided userId
    const userIdToUse = userId || `anonymous_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log(`Using user ID for rating: ${userIdToUse}`);

    // Always add a new rating (we don't try to update existing ratings for anonymous users)
    serviceProvider.ratings.push({
      userId: userIdToUse,
      value: rating
    });

    // Calculate new average rating
    serviceProvider.calculateAverageRating();
    
    // Print the ratings array for debugging
    console.log('All ratings after new addition:', serviceProvider.ratings.map(r => r.value));
    console.log(`Total ratings: ${serviceProvider.ratings.length}, Sum: ${serviceProvider.ratings.reduce((sum, r) => sum + r.value, 0)}`);
    
    await serviceProvider.save();

    console.log(`Rating saved successfully. New average: ${serviceProvider.rating}`);
    res.json({ 
      message: 'Rating submitted successfully', 
      newRating: serviceProvider.rating,
      ratingsCount: serviceProvider.ratings.length,
      // Include the breakdown of ratings for UI display
      ratingsBreakdown: {
        5: serviceProvider.ratings.filter(r => r.value === 5).length,
        4: serviceProvider.ratings.filter(r => r.value === 4).length,
        3: serviceProvider.ratings.filter(r => r.value === 3).length,
        2: serviceProvider.ratings.filter(r => r.value === 2).length,
        1: serviceProvider.ratings.filter(r => r.value === 1).length
      }
    });
  } catch (err) {
    console.error('Error in rating submission:', err);
    res.status(500).json({ message: err.message });
  }
});

// Update the GET /public route to include filtering, sorting and pagination

// Get public list of service providers (no authentication required)
router.get('/public', async (req, res) => {
  try {
    const { category, limit = 10, sort = 'rating', order = 'desc' } = req.query;
    
    // Build query
    const query = {};
    if (category) query.category = category;
    
    // Determine sort order
    const sortOptions = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;
    
    // Fetch providers with query, sort, and limit
    const serviceProviders = await ServiceProvider.find(query)
      .sort(sortOptions)
      .limit(Number(limit));
    
    // Return simplified data for public display
    const simplifiedProviders = serviceProviders.map(provider => ({
      _id: provider._id,
      name: provider.name,
      category: provider.category,
      profilePic: provider.profilePic,
      rating: provider.rating,
      isVerified: provider.isVerified
    }));
    
    res.json(simplifiedProviders);
  } catch (err) {
    console.error('Error fetching public service providers:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;