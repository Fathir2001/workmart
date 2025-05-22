const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const Job = require('../models/Job');
const Contact = require('../models/Contact');
const ServiceProvider = require('../models/ServiceProvider');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Configure multer for file uploads
const uploadDir = path.join(__dirname, '../uploads/profile');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const name = req.body.name || 'unnamed';
    const sanitizedName = name.replace(/[^a-zA-Z0-9]/g, '');
    const ext = path.extname(file.originalname);
    cb(null, `${sanitizedName}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only images (jpeg, jpg, png, gif) are allowed'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      console.log('No token provided in Authorization header');
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.id);
    if (!user) {
      console.log(`User not found for ID: ${decoded.id}`);
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.isAdmin) {
      console.log(`User ${decoded.id} is not an admin`);
      return res.status(403).json({ message: 'Access denied' });
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error('VerifyAdmin error:', err.message);
    res.status(401).json({ message: 'Invalid token', error: err.message });
  }
};

// Get all users
router.get('/users', verifyAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new user
router.post('/users', verifyAdmin, async (req, res) => {
  try {
    const { name, email, password, isAdmin, location } = req.body;
    const user = await User.create({ name, email, password, isAdmin, location });
    res.status(201).json(user);
  } catch (err) {
    console.error('Error creating user:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update a user
router.put('/users/:id', verifyAdmin, async (req, res) => {
  try {
    const { name, email, isAdmin, location } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, isAdmin, location },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Error updating user:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all jobs
router.get('/jobs', verifyAdmin, async (req, res) => {
  try {
    const jobs = await Job.find().populate('postedBy');
    res.json(jobs);
  } catch (err) {
    console.error('Error fetching jobs:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new job
router.post('/jobs', verifyAdmin, async (req, res) => {
  try {
    const { title, description } = req.body;
    const job = await Job.create({ title, description, postedBy: req.user.id });
    res.status(201).json(job);
  } catch (err) {
    console.error('Error creating job:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update a job
router.put('/jobs/:id', verifyAdmin, async (req, res) => {
  try {
    const { title, description } = req.body;
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { title, description },
      { new: true }
    );
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    console.error('Error updating job:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all contacts
router.get('/contacts', verifyAdmin, async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (err) {
    console.error('Error fetching contacts:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new contact
router.post('/contacts', verifyAdmin, async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const contact = await Contact.create({ name, email, message });
    res.status(201).json(contact);
  } catch (err) {
    console.error('Error creating contact:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update a contact
router.put('/contacts/:id', verifyAdmin, async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { name, email, message },
      { new: true }
    );
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    res.json(contact);
  } catch (err) {
    console.error('Error updating contact:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete a resource (users, jobs, contacts, service-providers)
router.delete('/:type/:id', verifyAdmin, async (req, res) => {
  try {
    const { type, id } = req.params;

    // Normalize the type to handle singular/plural variations
    const normalizedType = type.toLowerCase().replace('service-provider', 'service-providers');
    console.log(`Attempting to delete resource: ${normalizedType}/${id}`);

    const Model = {
      users: User,
      jobs: Job,
      contacts: Contact,
      'service-providers': ServiceProvider,
    }[normalizedType];

    if (!Model) {
      console.log(`Invalid resource type: ${normalizedType}`);
      return res.status(400).json({ message: 'Invalid resource type' });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log(`Invalid ID format: ${id}`);
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const resource = await Model.findByIdAndDelete(id);
    if (!resource) {
      console.log(`Resource not found: ${normalizedType}/${id}`);
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Handle file deletion for service providers
    if (normalizedType === 'service-providers' && resource.profilePic) {
      const filePath = path.join(__dirname, '../', resource.profilePic);
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`Deleted profile photo: ${filePath}`);
        } else {
          console.log(`Profile photo not found at: ${filePath}`);
        }
      } catch (fileErr) {
        console.error(`Error deleting profile photo at ${filePath}:`, fileErr.message);
        // Continue with the response even if file deletion fails
      }
    }

    console.log(`Successfully deleted ${normalizedType}/${id}`);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error(`Delete error for ${req.params.type}/${req.params.id}:`, err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all service providers (Admin only)
router.get('/service-providers', verifyAdmin, async (req, res) => {
  try {
    const serviceProviders = await ServiceProvider.find();
    res.json(serviceProviders);
  } catch (err) {
    console.error('Error fetching service providers:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Create a new service provider (Admin only) with file upload
router.post('/service-providers', verifyAdmin, upload.single('profilePic'), async (req, res) => {
  try {
    const { name, category, location, jobCount, rating, memberSince } = req.body;

    if (!name || !category || !location) {
      return res.status(400).json({ message: 'Name, category, and location are required' });
    }

    let profilePicPath = '';
    if (req.file) {
      profilePicPath = `uploads/profile/${req.file.filename}`;
    }

    const serviceProvider = await ServiceProvider.create({
      name,
      profilePic: profilePicPath,
      category,
      location,
      jobCount: Number(jobCount) || 0,
      rating: Number(rating) || 0,
      memberSince: memberSince || '',
    });

    res.status(201).json(serviceProvider);
  } catch (err) {
    console.error('Error creating service provider:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update a service provider (Admin only)
router.put('/service-providers/:id', verifyAdmin, upload.single('profilePic'), async (req, res) => {
  try {
    const { name, category, location, jobCount, rating, memberSince } = req.body;

    if (!name || !category || !location) {
      return res.status(400).json({ message: 'Name, category, and location are required' });
    }

    let updateData = {
      name,
      category,
      location,
      jobCount: Number(jobCount) || 0,
      rating: Number(rating) || 0,
      memberSince: memberSince || '',
    };

    if (req.file) {
      updateData.profilePic = `uploads/profile/${req.file.filename}`;
    }

    const serviceProvider = await ServiceProvider.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!serviceProvider) return res.status(404).json({ message: 'Service provider not found' });
    res.json(serviceProvider);
  } catch (err) {
    console.error('Error updating service provider:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all service providers (Public endpoint) with optional category filter
router.get('/public-service-providers', async (req, res) => {
  try {
    const { category } = req.query;

    const query = category
      ? { category: { $regex: `^${category}$`, $options: 'i' } } // Case-insensitive match
      : {};
    const serviceProviders = await ServiceProvider.find(query);
    res.json(serviceProviders);
  } catch (err) {
    console.error('Error fetching service providers (public):', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;