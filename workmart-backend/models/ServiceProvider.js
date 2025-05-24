const mongoose = require('mongoose');

const serviceProviderSchema = new mongoose.Schema({
  // Add this field to link to User
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
    default: 0, // Add jobCount field
  },
  rating: {
    type: Number,
    default: 0, // Add rating field (0 to 5)
  },
  memberSince: {
    type: String,
    default: '', // e.g., "Jun 2019"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ServiceProvider', serviceProviderSchema);