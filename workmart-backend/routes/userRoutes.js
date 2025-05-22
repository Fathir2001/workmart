const express = require('express');
const router = express.Router();
const User = require('../models/User');
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
    
    // Find user by either email or phone
    const user = await User.findOne({ 
      $or: [
        { email: emailOrPhone },
        { phone: emailOrPhone }
      ]
    });
    
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { userId: user._id }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1h' }
      );
      res.json({ token, user });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
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

module.exports = router;