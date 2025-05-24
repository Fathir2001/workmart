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
    const jobs = await Job.find()
      .populate('postedBy', 'name email')  // Populate the postedBy field with user name and email
      .sort({ createdAt: -1 });            // Sort by most recent first
    
    res.json(jobs);
  } catch (err) {
    console.error('Error fetching jobs:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a job with image upload
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const userId = req.userId;
    
    // Validate required fields
    if (!req.body.title || !req.body.description || !req.body.category || !req.body.location) {
      return res.status(400).json({ 
        message: 'Missing required fields. Title, description, category, and location are required.' 
      });
    }
    
    // Create job data
    const jobData = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      location: req.body.location,
      salary: req.body.salary ? parseFloat(req.body.salary) : undefined,
      experience: req.body.experience,
      contactNumber: req.body.contactNumber,
      availability: req.body.availability,
      postedBy: userId,
      image: req.file ? `uploads/${req.file.filename}` : undefined,
    };
    
    console.log("Creating job with data:", jobData);

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
    
    // If the job has an image, use it as the profile picture for the service provider
    if (req.file) {
      profilePic = `uploads/${req.file.filename}`;
    } 
    // Otherwise if user has a profile picture already, use that
    else if (user.profilePic) {
      profilePic = user.profilePic;
    }

    // If service provider not found, create a new record with full details
    if (!serviceProvider) {
      serviceProvider = new ServiceProvider({
        userId: userId,
        name: user.name || '',
        email: user.email || '',
        phoneNumber: req.body.contactNumber || user.phone || '',
        profilePic: profilePic,
        category: jobData.category,
        location: req.body.location || user.location || 'Not specified',
        jobCount: 1,
        rating: 0,
        experience: req.body.experience || 'Not specified',
        availability: req.body.availability || 'Not specified',
        memberSince: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short'
        }),
        description: jobData.description || '',
        specialties: [jobData.category],
        completedJobs: 0,
        isVerified: false
      });
      
      await serviceProvider.save();
    } else {
      // Update existing service provider with new information
      
      // Update job count
      serviceProvider.jobCount += 1;
      
      // Update category if different
      if (serviceProvider.category !== jobData.category) {
        serviceProvider.category = jobData.category;
        
        // Add to specialties if not already present
        if (!serviceProvider.specialties?.includes(jobData.category)) {
          serviceProvider.specialties = [...(serviceProvider.specialties || []), jobData.category];
        }
      }
      
      // Update profile picture if a new one was uploaded
      if (req.file && profilePic) {
        serviceProvider.profilePic = profilePic;
      }
      
      // Update additional fields if they're provided in this job but not in the service provider
      if (req.body.contactNumber && !serviceProvider.phoneNumber) {
        serviceProvider.phoneNumber = req.body.contactNumber;
      }
      
      if (req.body.experience && !serviceProvider.experience) {
        serviceProvider.experience = req.body.experience;
      }
      
      if (req.body.availability && !serviceProvider.availability) {
        serviceProvider.availability = req.body.availability;
      }
      
      if (req.body.location && !serviceProvider.location) {
        serviceProvider.location = req.body.location;
      }
      
      await serviceProvider.save();
    }

    // Return the newly created job with the service provider info
    const populatedJob = await Job.findById(newJob._id).populate('postedBy', 'name email');
    
    res.status(201).json({
      job: populatedJob,
      serviceProvider: serviceProvider
    });
    
  } catch (err) {
    console.error('Error creating job:', err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;