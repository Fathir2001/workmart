import React from 'react';
import { FaTimes, FaMapMarkerAlt, FaTag, FaPhone, FaEnvelope, FaStar, FaBriefcase, FaCalendarAlt, FaCheck, FaUserClock } from 'react-icons/fa';
import '../styles/DetailsModal.css';

const ServiceProviderDetailsModal = ({ provider, onClose }) => {
  if (!provider) return null;

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
              <div className="provider-rating">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className="star-icon"
                    style={{ color: i < (provider.rating || 0) ? '#f1c40f' : '#ddd' }}
                  />
                ))}
                <span className="rating-text">{provider.rating || 0}/5</span>
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
          <button className="contact-button">Contact Service Provider</button>
        </div>
      </div>
    </div>
  );
};

export default ServiceProviderDetailsModal;