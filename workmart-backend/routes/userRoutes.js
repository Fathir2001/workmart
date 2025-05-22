const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register user
router.post('/register', async (req, res) => {
  try {
    const { name, emailOrPhone, password, location } = req.body;
    const isEmail = emailOrPhone.includes('@');
    const userData = {
      name,
      password, // The pre-save hook will handle hashing
      location, // Add location to user data
    };
    if (isEmail) {
      userData.email = emailOrPhone;
    } else {
      userData.phone = emailOrPhone;
    }
    const user = new User(userData);
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
    const isEmail = emailOrPhone.includes('@');
    const query = isEmail ? { email: emailOrPhone } : { phone: emailOrPhone };
    const user = await User.findOne(query);
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token, user });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;