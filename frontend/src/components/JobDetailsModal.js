import React from 'react';
import { FaTimes, FaMoneyBillWave, FaMapMarkerAlt, FaTag, FaPhone, FaCalendarAlt, FaBriefcase } from 'react-icons/fa';
import '../styles/DetailsModal.css';

const JobDetailsModal = ({ job, onClose }) => {
  if (!job) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{job.title}</h2>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        
        <div className="modal-body">
          {job.image && (
            <div className="modal-image-container">
              <img 
                src={
                  job.image.startsWith('http')
                    ? job.image
                    : `http://localhost:5000/${job.image.replace(/^\/+/, '')}`
                }
                alt={job.title}
                className="modal-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/500x300?text=No+Image';
                }}
              />
            </div>
          )}
          
          <div className="detail-section">
            <h3>Job Description</h3>
            <p className="description">{job.description}</p>
          </div>
          
          <div className="detail-section">
            <h3>Job Details</h3>
            <div className="details-grid">
              <div className="detail-item">
                <FaTag className="detail-icon" />
                <div>
                  <span className="detail-label">Category</span>
                  <span className="detail-value">{job.category}</span>
                </div>
              </div>
              
              <div className="detail-item">
                <FaMapMarkerAlt className="detail-icon" />
                <div>
                  <span className="detail-label">Location</span>
                  <span className="detail-value">{job.location}</span>
                </div>
              </div>
              
              {job.salary && (
                <div className="detail-item">
                  <FaMoneyBillWave className="detail-icon" />
                  <div>
                    <span className="detail-label">Budget</span>
                    <span className="detail-value">Rs. {job.salary}</span>
                  </div>
                </div>
              )}
              
              {job.experience && (
                <div className="detail-item">
                  <FaBriefcase className="detail-icon" />
                  <div>
                    <span className="detail-label">Experience Level</span>
                    <span className="detail-value">{job.experience}</span>
                  </div>
                </div>
              )}
              
              {job.availability && (
                <div className="detail-item">
                  <FaCalendarAlt className="detail-icon" />
                  <div>
                    <span className="detail-label">Availability</span>
                    <span className="detail-value">{job.availability}</span>
                  </div>
                </div>
              )}
              
              {job.contactNumber && (
                <div className="detail-item">
                  <FaPhone className="detail-icon" />
                  <div>
                    <span className="detail-label">Contact Number</span>
                    <span className="detail-value">{job.contactNumber}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="detail-section">
            <h3>Posted By</h3>
            <p>
              {job.postedBy?.name || job.postedBy?.email || 'Anonymous'} on {formatDate(job.createdAt)}
            </p>
          </div>
        </div>
        
        <div className="modal-footer">
          {/* <button className="contact-button">Contact Job Poster</button> */}
        </div>
      </div>
    </div>
  );
};

export default JobDetailsModal;