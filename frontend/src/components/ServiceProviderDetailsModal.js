import React, { useState, useEffect } from 'react';
import { FaTimes, FaMapMarkerAlt, FaTag, FaPhone, FaEnvelope, FaStar, FaBriefcase, FaCalendarAlt, FaCheck, FaUserClock } from 'react-icons/fa';
import axios from 'axios';
import '../styles/DetailsModal.css';
import placeholderImage from '../Images/default-profile.jpg'; // Import the local placeholder image

// Define a base64 data URL for a simple placeholder image
const defaultImagePlaceholder = 'data:image/svg+xml;charset=UTF-8,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%23f0f0f0"/%3E%3Ctext x="50%25" y="50%25" font-size="18" text-anchor="middle" alignment-baseline="middle" font-family="Arial, sans-serif" fill="%23999999"%3ENo Image%3C/text%3E%3C/svg%3E';

const ServiceProviderDetailsModal = ({ provider, onClose, onRatingUpdate }) => {
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isRatingSubmitted, setIsRatingSubmitted] = useState(false);
  const [currentRating, setCurrentRating] = useState(provider?.rating || 0);
  const [ratingCount, setRatingCount] = useState(provider?.ratings?.length || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Update currentRating and ratingCount when provider changes
  useEffect(() => {
    if (provider) {
      setCurrentRating(provider.rating || 0);
      setRatingCount(provider.ratings?.length || 0);
    }
  }, [provider]);
  
  if (!provider) return null;

  const handleRatingHover = (rating) => {
    setHoverRating(rating);
  };
  
  const handleRatingClick = async (rating) => {
    if (isSubmitting) return;
    
    setUserRating(rating);
    setIsSubmitting(true);
    
    try {
      // Get current user ID from localStorage if available, or generate a session ID
      let userId = localStorage.getItem('userId');
      
      // If no userId exists, create a session ID for anonymous users
      if (!userId) {
        // Check if we already have an anonymous ID
        userId = localStorage.getItem('anonymousUserId');
        if (!userId) {
          // Generate a new anonymous ID
          userId = `anonymous_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          // Store it for future use
          localStorage.setItem('anonymousUserId', userId);
        }
      }
      
      const response = await axios.post(
        `http://localhost:5000/api/providers/${provider._id}/rate`,
        { rating, userId }
      );
      
      console.log('Rating response:', response.data);
      
      // Update the local state
      const newRating = response.data.newRating;
      const ratingsCount = response.data.ratingsCount;
      
      setCurrentRating(newRating);
      setIsRatingSubmitted(true);
      
      // Call the callback to update the parent component
      if (onRatingUpdate) {
        onRatingUpdate(provider._id, newRating, ratingsCount);
      }
      
      setTimeout(() => setIsRatingSubmitted(false), 3000);
    } catch (error) {
      console.error('Error submitting rating:', error);
      // More detailed error logging
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const renderStars = (isInteractive = false) => {
    return [...Array(5)].map((_, i) => {
      const starValue = i + 1;
      return (
        <FaStar
          key={i}
          className={`star-icon ${isInteractive ? 'interactive' : ''}`}
          style={{ 
            color: isInteractive 
              ? (starValue <= (hoverRating || userRating) ? '#f1c40f' : '#ddd')
              : (starValue <= Math.round(currentRating) ? '#f1c40f' : 
                 starValue - 0.5 <= currentRating ? '#f8e187' : '#ddd') // Partial stars for half ratings
          }}
          onMouseEnter={isInteractive ? () => handleRatingHover(starValue) : undefined}
          onMouseLeave={isInteractive ? () => handleRatingHover(0) : undefined}
          onClick={isInteractive ? () => handleRatingClick(starValue) : undefined}
        />
      );
    });
  };

  // Image loading error handler
  const handleImageError = (e) => {
    e.target.onerror = null; // Prevent infinite error loops
    e.target.src = placeholderImage; // Use local placeholder
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{provider.name}</h2>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        
        <div className="modal-body">
          <div className="provider-profile">
            <div className="provider-image-container">
              <img 
                src={
                  provider.profilePic
                    ? provider.profilePic.startsWith('http')
                      ? provider.profilePic
                      : `http://localhost:5000/${provider.profilePic.replace(/^\/+/, '')}`
                    : placeholderImage // Use local placeholder
                }
                alt={provider.name}
                className="provider-image"
                onError={handleImageError} // Use the new error handler
              />
            </div>
            <div className="provider-info">
              <h3 className="provider-name">{provider.name}</h3>
              <div className="provider-rating-display">
                <div className="current-rating">
                  {renderStars(false)}
                  <span className="rating-text">
                    {currentRating.toFixed(1)}/5 
                    <span className="rating-count">({ratingCount} {ratingCount === 1 ? 'rating' : 'ratings'})</span>
                  </span>
                </div>
              </div>
              <div className="user-rating-section">
                <p>Rate this service provider:</p>
                <div className="rating-input">
                  {renderStars(true)}
                </div>
                {isRatingSubmitted && (
                  <span className="rating-success">Thank you for your rating!</span>
                )}
              </div>
              <div className="provider-badge">
                <span className="badge">
                  {provider.isVerified ? (
                    <>
                      <FaCheck /> Verified
                    </>
                  ) : 'Not Verified'}
                </span>
                <span className="badge job-count-badge">
                  {provider.jobCount || 0} Jobs
                </span>
                <span className="badge completed-jobs-badge">
                  {provider.completedJobs || 0} Completed
                </span>
              </div>
              <p className="member-since">
                Member since {provider.memberSince || 'N/A'}
              </p>
            </div>
          </div>
          
          {provider.description && (
            <div className="detail-section">
              <h3>About</h3>
              <p className="description">{provider.description}</p>
            </div>
          )}
          
          <div className="detail-section">
            <h3>Service Details</h3>
            <div className="details-grid">
              <div className="detail-item">
                <FaTag className="detail-icon" />
                <div>
                  <span className="detail-label">Category</span>
                  <span className="detail-value">{provider.category}</span>
                </div>
              </div>
              
              <div className="detail-item">
                <FaMapMarkerAlt className="detail-icon" />
                <div>
                  <span className="detail-label">Location</span>
                  <span className="detail-value">{provider.location}</span>
                </div>
              </div>
              
              {provider.experience && (
                <div className="detail-item">
                  <FaBriefcase className="detail-icon" />
                  <div>
                    <span className="detail-label">Experience</span>
                    <span className="detail-value">{provider.experience}</span>
                  </div>
                </div>
              )}
              
              {provider.availability && (
                <div className="detail-item">
                  <FaUserClock className="detail-icon" />
                  <div>
                    <span className="detail-label">Availability</span>
                    <span className="detail-value">{provider.availability}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="detail-section">
            <h3>Contact Information</h3>
            <div className="details-grid">
              {provider.phoneNumber && (
                <div className="detail-item">
                  <FaPhone className="detail-icon" />
                  <div>
                    <span className="detail-label">Phone</span>
                    <span className="detail-value">{provider.phoneNumber}</span>
                  </div>
                </div>
              )}
              
              {provider.email && (
                <div className="detail-item">
                  <FaEnvelope className="detail-icon" />
                  <div>
                    <span className="detail-label">Email</span>
                    <span className="detail-value">{provider.email}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {provider.specialties?.length > 0 && (
            <div className="detail-section">
              <h3>Specialties</h3>
              <div className="specialties-list">
                {provider.specialties.map((specialty, index) => (
                  <span key={index} className="specialty-tag">{specialty}</span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          {/* <button className="contact-button">Contact Service Provider</button> */}
        </div>
      </div>
    </div>
  );
};

export default ServiceProviderDetailsModal;