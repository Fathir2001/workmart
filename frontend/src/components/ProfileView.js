import React, { useState, useEffect } from "react";
import '../styles/ProfileView.css';
import { FaStar, FaPhone, FaComments, FaMapMarkerAlt, FaEnvelope, FaUser, FaToolbox, FaCalendarAlt, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import axios from 'axios';
import defaultProfileImage from "../Images/Frame 611.png";

const ProfileView = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isServiceProvider, setIsServiceProvider] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [updateMessage, setUpdateMessage] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

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
          setEditFormData(serviceProviderResponse.data);
          setIsServiceProvider(true);
        } else {
          // User is not a service provider, use regular user data
          setUserData(userResponse.data);
          setEditFormData(userResponse.data);
          setIsServiceProvider(false);
        }
      } catch (spError) {
        // If there's an error or the user is not a service provider,
        // fall back to regular user data
        setUserData(userResponse.data);
        setEditFormData(userResponse.data);
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

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditFormData(userData); // Reset form data to current user data
    setUpdateMessage(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (isServiceProvider) {
        // Update service provider profile
        await axios.put(
          'http://localhost:5000/api/users/update-service-provider',
          editFormData,
          config
        );
      } else {
        // Update regular user profile
        await axios.put(
          'http://localhost:5000/api/users/update-profile',
          editFormData,
          config
        );
      }

      // Refresh user data
      await fetchUserProfile();
      setIsEditing(false);
      setUpdateMessage("Profile updated successfully!");
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setUpdateMessage(null);
      }, 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || "Failed to update profile");
      setLoading(false);
    }
  };

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
      {updateMessage && (
        <div className="wm-pv__update-message">
          {updateMessage}
        </div>
      )}
      
      <div className="wm-pv__header">
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
        
        <div className="wm-pv__title-actions">
          <h2 className="wm-pv__name">{userData.name || "User"}</h2>
          
          {!isEditing ? (
            <button className="wm-pv__edit-button" onClick={handleEdit}>
              <FaEdit /> Edit Profile
            </button>
          ) : (
            <div className="wm-pv__edit-actions">
              <button className="wm-pv__save-button" onClick={handleSaveChanges}>
                <FaSave /> Save Changes
              </button>
              <button className="wm-pv__cancel-button" onClick={handleCancelEdit}>
                <FaTimes /> Cancel
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="wm-pv__details">
        {!isEditing ? (
          // View mode
          <>
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
          </>
        ) : (
          // Edit mode
          <div className="wm-pv__edit-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={editFormData.name || ""}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={editFormData.email || ""}
                onChange={handleInputChange}
                className="form-control"
                disabled={isServiceProvider} // Only regular users can edit email
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="text"
                id="phone"
                name={isServiceProvider ? "phoneNumber" : "phone"}
                value={editFormData.phoneNumber || editFormData.phone || ""}
                onChange={handleInputChange}
                className="form-control"
                placeholder="e.g., 0771234567"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <select
                id="location"
                name="location"
                value={editFormData.location || ""}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="">Select a location</option>
                <option value="Colombo">Colombo</option>
                <option value="Gampaha">Gampaha</option>
                <option value="Kalutara">Kalutara</option>
                <option value="Kandy">Kandy</option>
                <option value="Matale">Matale</option>
                <option value="Nuwara Eliya">Nuwara Eliya</option>
                <option value="Galle">Galle</option>
                <option value="Matara">Matara</option>
                <option value="Hambantota">Hambantota</option>
                <option value="Jaffna">Jaffna</option>
                <option value="Kilinochchi">Kilinochchi</option>
                <option value="Mannar">Mannar</option>
                <option value="Mullaitivu">Mullaitivu</option>
                <option value="Vavuniya">Vavuniya</option>
                <option value="Batticaloa">Batticaloa</option>
                <option value="Ampara">Ampara</option>
                <option value="Trincomalee">Trincomalee</option>
                <option value="Kurunegala">Kurunegala</option>
                <option value="Puttalam">Puttalam</option>
                <option value="Anuradhapura">Anuradhapura</option>
                <option value="Polonnaruwa">Polonnaruwa</option>
                <option value="Badulla">Badulla</option>
                <option value="Monaragala">Monaragala</option>
                <option value="Ratnapura">Ratnapura</option>
                <option value="Kegalle">Kegalle</option>
              </select>
            </div>
            
            {isServiceProvider && (
              <>
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={editFormData.description || ""}
                    onChange={handleInputChange}
                    className="form-control"
                    rows="4"
                    placeholder="Tell others about your skills and experience"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={editFormData.category || ""}
                    onChange={handleInputChange}
                    className="form-control"
                  >
                    <option value="">Select a category</option>
                    <option value="Technicians">Technicians</option>
                    <option value="AC Repairs">AC Repairs</option>
                    <option value="CCTV">CCTV</option>
                    <option value="Constructions">Constructions</option>
                    <option value="Electricians">Electricians</option>
                    <option value="Electronic Repairs">Electronic Repairs</option>
                    <option value="Glass & Aluminium">Glass & Aluminium</option>
                    <option value="Iron Works">Iron Works</option>
                    <option value="Masonry">Masonry</option>
                    <option value="Odd Jobs">Odd Jobs</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Wood Works">Wood Works</option>
                    <option value="Vehicles">Vehicles</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="experience">Experience Level</label>
                  <select
                    id="experience"
                    name="experience"
                    value={editFormData.experience || ""}
                    onChange={handleInputChange}
                    className="form-control"
                  >
                    <option value="">Select experience level</option>
                    <option value="Entry">Entry Level</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="availability">Availability</label>
                  <select
                    id="availability"
                    name="availability"
                    value={editFormData.availability || ""}
                    onChange={handleInputChange}
                    className="form-control"
                  >
                    <option value="">Select availability</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Weekends">Weekends only</option>
                    <option value="Flexible">Flexible hours</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="specialties">Specialties (comma separated)</label>
                  <input
                    type="text"
                    id="specialties"
                    name="specialties"
                    value={Array.isArray(editFormData.specialties) ? editFormData.specialties.join(", ") : ""}
                    onChange={(e) => {
                      const specialtiesArray = e.target.value
                        .split(",")
                        .map(item => item.trim())
                        .filter(item => item !== "");
                      
                      setEditFormData({
                        ...editFormData,
                        specialties: specialtiesArray,
                      });
                    }}
                    className="form-control"
                    placeholder="e.g. Bathroom fixtures, Kitchen plumbing"
                  />
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileView;