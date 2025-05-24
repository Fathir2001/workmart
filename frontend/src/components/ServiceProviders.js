import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTwitter, FaInstagram, FaLinkedin, FaTools } from 'react-icons/fa';
import '../styles/ServiceProviders.css';
import defaultProfileImage from '../Images/default-profile.jpg'; // Add a default image
import { useNavigate } from "react-router-dom";

const ServiceProviders = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/providers/public');
        
        // Get top 4 providers with highest ratings
        const topProviders = response.data
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 4);
          
        setProviders(topProviders);
        setError(null);
      } catch (err) {
        console.error('Error fetching service providers:', err);
        setError('Failed to load service providers');
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  return (
    <div className="service-providers-section">
      <div className="providers-container">
        <div className="providers-content">
          <h2 className="providers-title">Meet the best</h2>
          <h1 className="providers-title">service Providers</h1>
          <p className="providers-description">
            Register with us today, start doing jobs and get paid
          </p>
          <button className="register-button" onClick={() => navigate("/register")} >Register Now</button>
        </div>

        <div className="providers-profiles">
          {loading ? (
            <div className="providers-loading">Loading top providers...</div>
          ) : error ? (
            <div className="providers-error">{error}</div>
          ) : providers.length > 0 ? (
            providers.map((provider) => (
              <div key={provider._id} className="provider-card">
                <img 
                  src={provider.profilePic ? 
                    provider.profilePic.startsWith('http') ? 
                      provider.profilePic : 
                      `http://localhost:5000/${provider.profilePic.replace(/^\/+/, '')}` 
                    : defaultProfileImage} 
                  alt={provider.name} 
                  className="provider-image"
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = defaultProfileImage;
                  }} 
                />
                <h3 className="provider-name">{provider.name}</h3>
                <p className="provider-category">
                  <span className="category-icon"><FaTools /></span>
                  {provider.category}
                </p>
                <div className="provider-rating">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`star ${i < Math.round(provider.rating) ? 'filled' : ''}`}>★</span>
                  ))}
                  <span className="rating-value">{provider.rating.toFixed(1)}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="no-providers">
              <p>No service providers available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceProviders;