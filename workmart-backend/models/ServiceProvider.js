const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: 'anonymous' // For non-logged in users
  },
  value: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

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
  ratings: {
    type: [ratingSchema],
    default: []
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

// Method to calculate average rating
serviceProviderSchema.methods.calculateAverageRating = function() {
  if (this.ratings.length === 0) {
    this.rating = 0;
    return;
  }
  
  const sum = this.ratings.reduce((total, rating) => total + rating.value, 0);
  this.rating = Math.round((sum / this.ratings.length) * 10) / 10; // Round to 1 decimal place
};

module.exports = mongoose.model('ServiceProvider', serviceProviderSchema);