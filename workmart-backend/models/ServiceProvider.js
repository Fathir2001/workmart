const mongoose = require('mongoose');

const serviceProviderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
  },
  phoneNumber: {
    type: String,
    trim: true,
  },
  profilePic: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  jobCount: {
    type: Number,
    default: 0,
  },
  completedJobs: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
  },
  experience: {
    type: String,
    default: '',
  },
  availability: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  specialties: {
    type: [String],
    default: [],
  },
  memberSince: {
    type: String,
    default: '',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ServiceProvider', serviceProviderSchema);