const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const Job = require('../models/Job');

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Store images in 'uploads/' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only JPEG, JPG, and PNG images are allowed'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5MB
});

// Middleware to authenticate user
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded; // Decoded token contains { id, isAdmin }
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find().populate('postedBy', 'username email');
    res.json(jobs);
  } catch (err) {
    console.error('Error fetching jobs:', err);
    res.status(500).json({ message: err.message });
  }
});

// Create a job with image upload
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const jobData = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      salary: req.body.salary ? parseFloat(req.body.salary) : undefined,
      postedBy: req.user.id, // Use req.user.id instead of req.user.userId
      image: req.file ? `/uploads/${req.file.filename}` : undefined, // Save image path
    };

    // Validate category
    const validCategories = [
      'Technicians', 'AC Repairs', 'CCTV', 'Constructions', 'Electricians',
      'Electronic Repairs', 'Glass & Aluminium', 'Iron Works', 'Masonry',
      'Odd Jobs', 'Plumbing', 'Wood Works', 'Vehicles'
    ];
    if (!validCategories.includes(jobData.category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    // Validate salary if provided
    if (jobData.salary && jobData.salary <= 0) {
      return res.status(400).json({ message: 'Salary must be a positive number' });
    }

    const job = new Job(jobData);
    const newJob = await job.save();
    res.status(201).json(newJob);
  } catch (err) {
    console.error('Error creating job:', err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;