import React, { useState } from 'react';
import { FaTimes, FaMapMarkerAlt, FaTag, FaPhone, FaEnvelope, FaStar, FaBriefcase, FaCalendarAlt, FaCheck, FaUserClock } from 'react-icons/fa';
import axios from 'axios';
import '../styles/DetailsModal.css';

const ServiceProviderDetailsModal = ({ provider, onClose }) => {
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isRatingSubmitted, setIsRatingSubmitted] = useState(false);
  const [currentRating, setCurrentRating] = useState(provider?.rating || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (!provider) return null;

  const handleRatingHover = (rating) => {
    setHoverRating(rating);
  };
  
  const handleRatingClick = async (rating) => {
    if (isSubmitting) return;
    
    setUserRating(rating);
    setIsSubmitting(true);
    
    try {
      // Get current user ID from localStorage if available
      const userId = localStorage.getItem('userId') || null;
      
      // Log the request details for debugging
      console.log('Sending rating request to:', `http://localhost:5000/api/providers/${provider._id}/rate`);
      console.log('Provider ID:', provider._id);
      console.log('Request payload:', { rating, userId });
      
      const response = await axios.post(
        `http://localhost:5000/api/providers/${provider._id}/rate`,
        { rating, userId }
      );
      
      console.log('Rating response:', response.data);
      
      // Update the displayed rating with the new average from server
      setCurrentRating(response.data.newRating);
      setIsRatingSubmitted(true);
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
              : (starValue <= currentRating ? '#f1c40f' : '#ddd')
          }}
          onMouseEnter={isInteractive ? () => handleRatingHover(starValue) : undefined}
          onMouseLeave={isInteractive ? () => handleRatingHover(0) : undefined}
          onClick={isInteractive ? () => handleRatingClick(starValue) : undefined}
        />
      );
    });
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
                    : 'https://via.placeholder.com/200?text=No+Image'
                }
                alt={provider.name}
                className="provider-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/200?text=No+Image';
                }}
              />
            </div>
            <div className="provider-info">
              <h3 className="provider-name">{provider.name}</h3>
              <div className="provider-rating-display">
                <div className="current-rating">
                  {renderStars(false)}
                  <span className="rating-text">{currentRating}/5</span>
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