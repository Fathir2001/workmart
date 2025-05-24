const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const Job = require('../models/Job');
const User = require('../models/User');
const ServiceProvider = require('../models/ServiceProvider');

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
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.userId = decoded.id;  // This line is important - it should set req.userId
    req.user = decoded; // Keep this for backward compatibility
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(401).json({ message: 'Token is not valid' });
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
    const userId = req.userId;
    
    // Create job data
    const jobData = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      salary: req.body.salary ? parseFloat(req.body.salary) : undefined,
      postedBy: userId,
      image: req.file ? `uploads/${req.file.filename}` : undefined, // Notice I removed the leading slash
    };

    // Create the job
    const job = new Job(jobData);
    const newJob = await job.save();

    // Get user information
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user already exists as a service provider
    let serviceProvider = await ServiceProvider.findOne({ userId: userId });

    // Determine profile pic path
    let profilePic = '';
    
    // If the user uploaded an image for this job, use it as the profile picture
    if (req.file) {
      profilePic = `uploads/${req.file.filename}`;
    } 
    // Otherwise if user has a profilePic already, use that
    else if (user.profilePic) {
      profilePic = user.profilePic;
    }

    // If not found, create a new service provider record
    if (!serviceProvider) {
      serviceProvider = new ServiceProvider({
        userId: userId,
        name: user.name,
        profilePic: profilePic, // Set the profile picture
        category: jobData.category,
        location: user.location || 'Not specified',
        jobCount: 1,
        rating: 0,
        memberSince: new Date().toISOString().split('T')[0],
      });
      
      await serviceProvider.save();
    } else {
      // Update existing service provider
      serviceProvider.jobCount += 1;
      
      // Update category if needed
      if (serviceProvider.category !== jobData.category) {
        serviceProvider.category = jobData.category;
      }
      
      // Update profile picture if a new one was uploaded and there isn't one already
      if (profilePic && (!serviceProvider.profilePic || serviceProvider.profilePic === '')) {
        serviceProvider.profilePic = profilePic;
      }
      
      await serviceProvider.save();
    }

    res.status(201).json({
      job: newJob,
      serviceProvider: serviceProvider
    });
    
  } catch (err) {
    console.error('Error creating job:', err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;