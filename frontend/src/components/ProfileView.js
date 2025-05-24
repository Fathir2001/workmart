import React, { useState, useEffect } from "react";
import '../styles/ProfileView.css';
import { FaStar, FaPhone, FaComments, FaMapMarkerAlt, FaEnvelope, FaUser } from "react-icons/fa";
import axios from 'axios';
import defaultProfileImage from "../Images/Frame 611.png";

const ProfileView = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError("You must be logged in to view this page");
          setLoading(false);
          return;
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get('http://localhost:5000/api/users/profile', config);
        
        console.log('Profile data received:', response.data);
        setUserData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        
        if (err.response?.status === 401) {
          // Unauthorized - token expired or invalid
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setError("Your session has expired. Please login again.");
        } else if (err.response?.status === 404) {
          setError("User profile not found. The profile endpoint might not be set up correctly.");
        } else {
          setError(err.response?.data?.message || "Failed to load profile data");
        }
        
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <div className="wm-pv__container wm-pv__container--loading">
        <p>Loading your profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wm-pv__container wm-pv__container--error">
        <p className="wm-pv__error-message">{error}</p>
        <a href="/login" className="wm-pv__login-link">Go to Login</a>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="wm-pv__container wm-pv__container--error">
        <p>No profile data available</p>
      </div>
    );
  }

  return (
    <div className="wm-pv__container">
      <div className="wm-pv__image-section">
        <img 
          src={userData.profilePic ? `http://localhost:5000/${userData.profilePic}` : defaultProfileImage} 
          alt="Profile" 
          className="wm-pv__profile-image"
          onError={(e) => e.target.src = defaultProfileImage}
        />
      </div>
      <div className="wm-pv__details">
        <h2 className="wm-pv__name">{userData.name || "User"}</h2>
        
        <div className="wm-pv__info-section">
          <div className="wm-pv__info-item">
            <FaEnvelope className="wm-pv__info-icon" />
            <span>{userData.email || "No email provided"}</span>
          </div>
          
          <div className="wm-pv__info-item">
            <FaPhone className="wm-pv__info-icon" />
            <span>{userData.phone || "No phone number provided"}</span>
          </div>
          
          <div className="wm-pv__info-item">
            <FaMapMarkerAlt className="wm-pv__info-icon" />
            <span>{userData.location || "No location provided"}</span>
          </div>
          
          <div className="wm-pv__info-item">
            <FaUser className="wm-pv__info-icon" />
            <span>{userData.isAdmin ? "Administrator" : "Regular User"}</span>
          </div>
          
          <div className="wm-pv__info-item">
            <span className="wm-pv__info-label">Member since:</span>
            <span>{new Date(userData.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        
        {userData.isServiceProvider && (
          <>
            <div className="wm-pv__rating-section">
              <div className="wm-pv__rating">
                {[...Array(5)].map((_, i) => (
                  <FaStar 
                    key={i} 
                    className="wm-pv__star-icon" 
                    style={{ color: i < (userData.rating || 0) ? 'gold' : 'gray' }}
                  />
                ))}
                <span className="wm-pv__reviews">({userData.reviewCount || 0} Reviews)</span>
              </div>
              <p className="wm-pv__description">
                {userData.description || "No description provided"}
              </p>
            </div>
            
            <h3 className="wm-pv__registration-title">Registrations:</h3>
            <div className="wm-pv__registrations">
              {userData.skills?.length > 0 ? 
                userData.skills.map((skill, i) => (
                  <span key={i} className="wm-pv__badge">{skill}</span>
                )) : 
                <span className="wm-pv__no-skills">No skills registered</span>
              }
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileView;