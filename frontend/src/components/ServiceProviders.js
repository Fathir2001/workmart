import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTools, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import '../styles/ServiceProviders.css';
import defaultProfileImage from '../Images/default-profile.jpg';
import { useNavigate } from "react-router-dom";

const ServiceProviders = () => {
  const [providers, setProviders] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // Number of providers to show at once
  const providersPerView = 2;

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/providers/public');
        
        // Get top providers with highest ratings (getting more than we need for pagination)
        const topProviders = response.data
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 8); // Get up to 8 providers for rotation
          
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

  // Navigate to next providers
  const nextProviders = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + providersPerView;
      // If we've reached the end, loop back to the beginning
      return nextIndex >= providers.length ? 0 : nextIndex;
    });
  };

  // Navigate to previous providers
  const prevProviders = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex - providersPerView;
      // If we've gone before the beginning, loop to the end
      return nextIndex < 0 ? Math.max(0, providers.length - providersPerView) : nextIndex;
    });
  };

  // Get current visible providers
  const visibleProviders = providers.slice(currentIndex, currentIndex + providersPerView);

  return (
    <div className="service-providers-section">
      <div className="providers-container">
        <div className="providers-content">
          <h2 className="providers-title">Meet the best</h2>
          <h1 className="providers-title">service Providers</h1>
          <p className="providers-description">
            Register with us today, start doing jobs and get paid
          </p>
          <button className="register-button" onClick={() => navigate("/register")}>Register Now</button>
        </div>

        <div className="providers-showcase">
          {loading ? (
            <div className="providers-loading">Loading top providers...</div>
          ) : error ? (
            <div className="providers-error">{error}</div>
          ) : providers.length > 0 ? (
            <>
              <div className="providers-profiles">
                {visibleProviders.map((provider) => (
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
                ))}
              </div>
              
              {/* Navigation controls */}
              <div className="providers-navigation">
                <button 
                  className="provider-nav-button prev-button" 
                  onClick={prevProviders}
                  aria-label="Previous providers"
                >
                  <FaChevronLeft />
                </button>
                
                {/* Pagination indicators */}
                <div className="providers-pagination">
                  {Array.from({ length: Math.ceil(providers.length / providersPerView) }, (_, i) => (
                    <span 
                      key={i} 
                      className={`pagination-dot ${Math.floor(currentIndex / providersPerView) === i ? 'active' : ''}`}
                      onClick={() => setCurrentIndex(i * providersPerView)}
                    />
                  ))}
                </div>
                
                <button 
                  className="provider-nav-button next-button" 
                  onClick={nextProviders}
                  aria-label="Next providers"
                >
                  <FaChevronRight />
                </button>
              </div>
            </>
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