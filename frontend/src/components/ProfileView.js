import React, { useState, useEffect } from "react";
import '../styles/ProfileView.css';
import { FaStar, FaPhone, FaComments, FaMapMarkerAlt, FaEnvelope, FaUser, FaToolbox, FaCalendarAlt } from "react-icons/fa";
import axios from 'axios';
import defaultProfileImage from "../Images/Frame 611.png";

const ProfileView = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isServiceProvider, setIsServiceProvider] = useState(false);

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
        
        // First, get the user's basic profile
        const userResponse = await axios.get('http://localhost:5000/api/users/profile', config);
        
        // Check if this user is also a service provider
        try {
          const serviceProviderResponse = await axios.get(`http://localhost:5000/api/users/service-provider-profile`, config);
          
          if (serviceProviderResponse.data) {
            // User is a service provider, use that data
            setUserData(serviceProviderResponse.data);
            setIsServiceProvider(true);
          } else {
            // User is not a service provider, use regular user data
            setUserData(userResponse.data);
            setIsServiceProvider(false);
          }
        } catch (spError) {
          // If there's an error or the user is not a service provider,
          // fall back to regular user data
          setUserData(userResponse.data);
          setIsServiceProvider(false);
        }
        
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
          src={
            isServiceProvider && userData.profilePic 
              ? `http://localhost:5000/${userData.profilePic}` 
              : defaultProfileImage
          } 
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
            <span>{userData.phoneNumber || userData.phone || "No phone number provided"}</span>
          </div>
          
          <div className="wm-pv__info-item">
            <FaMapMarkerAlt className="wm-pv__info-icon" />
            <span>{userData.location || "No location provided"}</span>
          </div>
          
          <div className="wm-pv__info-item">
            <FaUser className="wm-pv__info-icon" />
            <span>{userData.isAdmin ? "Administrator" : isServiceProvider ? "Service Provider" : "Regular User"}</span>
          </div>
          
          {userData.createdAt && (
            <div className="wm-pv__info-item">
              <span className="wm-pv__info-label">Member since:</span>
              <span>{new Date(userData.createdAt).toLocaleDateString()}</span>
            </div>
          )}
          
          {isServiceProvider && userData.memberSince && (
            <div className="wm-pv__info-item">
              <span className="wm-pv__info-label">Service Provider since:</span>
              <span>{userData.memberSince}</span>
            </div>
          )}
        </div>
        
        {isServiceProvider && (
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
                <span className="wm-pv__reviews">({userData.jobCount || 0} Jobs, {userData.completedJobs || 0} Completed)</span>
              </div>
              <p className="wm-pv__description">
                {userData.description || "No description provided"}
              </p>
            </div>
            
            <h3 className="wm-pv__registration-title">Category:</h3>
            <div className="wm-pv__registrations">
              <span className={`wm-pv__badge wm-pv__badge--${userData.category?.toLowerCase()}`}>
                {userData.category || "Not specified"}
              </span>
            </div>
            
            {userData.specialties?.length > 0 && (
              <>
                <h3 className="wm-pv__specialties-title">Specialties:</h3>
                <div className="wm-pv__registrations">
                  {userData.specialties.map((specialty, i) => (
                    <span key={i} className="wm-pv__badge">{specialty}</span>
                  ))}
                </div>
              </>
            )}
            
            {userData.experience && (
              <div className="wm-pv__info-item">
                <FaToolbox className="wm-pv__info-icon" />
                <span><strong>Experience:</strong> {userData.experience}</span>
              </div>
            )}
            
            {userData.availability && (
              <div className="wm-pv__info-item">
                <FaCalendarAlt className="wm-pv__info-icon" />
                <span><strong>Availability:</strong> {userData.availability}</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileView;