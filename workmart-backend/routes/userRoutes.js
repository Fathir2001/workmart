const express = require('express');
const router = express.Router();
const User = require('../models/User');
const ServiceProvider = require('../models/ServiceProvider'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { auth } = require('../middleware/auth');

// Register user
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, location } = req.body;
    
    // Validate that either email or phone is provided
    if (!email && !phone) {
      return res.status(400).json({ message: "Either email or phone is required" });
    }
    
    // Check if a user with the same email or phone already exists
    const existingUser = await User.findOne({ 
      $or: [
        { email: email },
        { phone: phone }
      ]
    });
    
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: "Email already registered" });
      } else {
        return res.status(400).json({ message: "Phone number already registered" });
      }
    }
    
    // Create the user with separate email and phone fields
    const user = new User({
      name,
      email,
      phone,
      password,
      location
    });
    
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;
    
    // Find user by email or phone
    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }]
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Create token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );
    
    // Send response with token and user data
    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile (requires authentication)
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error fetching user profile:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get service provider profile for the logged-in user
router.get('/service-provider-profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if this user is a service provider
    const serviceProvider = await ServiceProvider.findOne({ userId: req.userId });
    
    if (!serviceProvider) {
      return res.status(404).json({ message: 'Service provider profile not found' });
    }
    
    // Return the service provider data
    res.json(serviceProvider);
  } catch (err) {
    console.error('Error fetching service provider profile:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/update-profile', auth, async (req, res) => {
  try {
    const { name, email, phone, location } = req.body;
    
    // Find the user
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if email is being changed and if it's already taken
    if (email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: 'Email is already in use' });
      }
    }
    
    // Check if phone is being changed and if it's already taken
    if (phone !== user.phone) {
      const phoneExists = await User.findOne({ phone });
      if (phoneExists) {
        return res.status(400).json({ message: 'Phone number is already in use' });
      }
    }
    
    // Update user fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (location) user.location = location;
    
    const updatedUser = await user.save();
    
    // Return updated user without password
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      location: updatedUser.location,
      isAdmin: updatedUser.isAdmin,
      createdAt: updatedUser.createdAt
    });
  } catch (err) {
    console.error('Error updating profile:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update service provider profile
router.put('/update-service-provider', auth, async (req, res) => {
  try {
    const { 
      name, phoneNumber, location, description, category, 
      experience, availability, specialties 
    } = req.body;
    
    // First, check if the user exists
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Then check if service provider profile exists
    let serviceProvider = await ServiceProvider.findOne({ userId: req.userId });
    
    if (!serviceProvider) {
      return res.status(404).json({ message: 'Service provider profile not found' });
    }
    
    // Update service provider fields
    if (name) {
      serviceProvider.name = name;
      // Also update the user's name to keep them in sync
      user.name = name;
      await user.save();
    }
    
    if (phoneNumber) serviceProvider.phoneNumber = phoneNumber;
    if (location) serviceProvider.location = location;
    if (description) serviceProvider.description = description;
    if (category) serviceProvider.category = category;
    if (experience) serviceProvider.experience = experience;
    if (availability) serviceProvider.availability = availability;
    if (specialties) serviceProvider.specialties = specialties;
    
    const updatedServiceProvider = await serviceProvider.save();
    res.json(updatedServiceProvider);
  } catch (err) {
    console.error('Error updating service provider profile:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;