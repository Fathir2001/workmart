

import React from "react";
import '../styles/ProfileView.css';
import { FaStar, FaPhone, FaComments } from "react-icons/fa";
import profileImage from "../Images/Frame 611.png";


const ProfileView = () => {
  return (
    <div className="profile-container">
      <div className="profile-image-section">
        <img src={profileImage} alt="Profile" className="profile-image" />
      </div>
      <div className="profile-details">
        <h2 className="profile-name">K A H Hasaranga Rasanjana</h2>
        <div className="rating-section">
          <div className="rating">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className="star-icon" />
            ))}
            <span className="reviews">(108 Reviews)</span>
          </div>
          <p className="description">
            All plumbing work fix and replace electronic value and new technology system
          </p>
        </div>
        <h3 className="registration-title">Registrations:</h3>
        <div className="registrations">
          {[...Array(18)].map((_, i) => (
            <span key={i} className={`badge ${i === 2 ? "plumbing" : ""}`}>Drivers</span>
          ))}
        </div>
        <div className="contact-section">
          <div className="contact-item">
            <FaPhone className="icon" />
            <span>077 4567 678</span>
            <a href="#" className="show-number">Click to show phone number</a>
          </div>
          <div className="contact-item">
            <FaComments className="icon" />
            <a href="#" className="chat-link">Click here to chat</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;