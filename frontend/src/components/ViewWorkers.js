import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { FaTag, FaMapMarkerAlt, FaEye, FaStar } from 'react-icons/fa';
import SideBar from './SideBar';
import '../styles/ViewWorkers.css';

// Import banner images
import allServices from '../Images/banners/all-services.jpg';
import technicians from '../Images/banners/technicians.jpg';
import acReports from '../Images/banners/ac-reports.jpg';
import cctv from '../Images/banners/cctv.jpg';
import electricians from '../Images/banners/electricians.jpg';
import plumbing from '../Images/banners/plumbing.jpg';
import ironWorks from '../Images/banners/iron-works.jpg';
import woodWorks from '../Images/banners/wood-works.jpg';
import fallbackBanner from '../Images/banners/fallback-banner.png';

const ViewWorkers = () => {
  const [serviceProviders, setServiceProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [allServiceProviders, setAllServiceProviders] = useState([]); // Store all providers for client-side filtering

  const bannerImages = [
    allServices,
    technicians,
    acReports,
    cctv,
    electricians,
    plumbing,
    ironWorks,
    woodWorks,
  ];

  // Define available categories
  const categories = useMemo(() => [
    'ALL',
    'Technicians',
    'AC Reports',
    'CCTV',
    'Electricians',
    'Iron Works',
    'Plumbing',
    'Wood Works',
  ], []);

  // Map UI-friendly category names to backend formats
  const categoryMap = useMemo(() => ({
    'ALL': null,
    'Technicians': 'TECHNICIANS',
    'AC Reports': 'AC_REPORTS',
    'CCTV': 'CCTV',
    'Electricians': 'ELECTRICIANS',
    'Iron Works': 'IRON_WORKS',
    'Plumbing': 'PLUMBING',
    'Wood Works': 'WOOD_WORKS',
  }), []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % bannerImages.length;
        return newIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [bannerImages.length]);

  // Fetch all service providers on component mount
  useEffect(() => {
    const fetchAllServiceProviders = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use the public endpoint instead of the admin endpoint
        const url = 'http://localhost:5000/api/public/service-providers';
        console.log('Fetching all service providers from:', url);
        
        const response = await axios.get(url);

        if (!Array.isArray(response.data)) {
          throw new Error('Expected an array of service providers, but received: ' + JSON.stringify(response.data));
        }

        setAllServiceProviders(response.data);
        setServiceProviders(response.data); // Initially show all providers
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.response ? `${err.response.status}: ${err.response.data.message || err.message}` : err.message);
        setLoading(false);
      }
    };

    fetchAllServiceProviders();
  }, []);

  // Filter service providers when selected category changes
  useEffect(() => {
    if (allServiceProviders.length === 0) return; // Skip if no data loaded yet
    
    setLoading(true);
    
    try {
      // If "ALL" is selected, show all service providers
      if (selectedCategory === 'ALL') {
        setServiceProviders(allServiceProviders);
      } else {
        // Filter providers client-side based on selected category
        const backendCategory = categoryMap[selectedCategory];
        
        const filteredProviders = allServiceProviders.filter(provider => {
          // Check both formats of category to be safe
          return (
            provider.category === backendCategory || 
            provider.category === selectedCategory ||
            // Handle potential case differences or format variations
            (provider.category && 
             (provider.category.toUpperCase() === backendCategory || 
              provider.category.toUpperCase() === selectedCategory.toUpperCase()))
          );
        });
        
        setServiceProviders(filteredProviders);
      }
    } catch (err) {
      console.error('Filtering error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, allServiceProviders, categoryMap]);

  const handleCategorySelect = (category) => {
    if (categories.includes(category)) {
      console.log(`Selecting category: ${category}`);
      setSelectedCategory(category);
    } else {
      console.warn(`Invalid category selected: ${category}`);
    }
  };

  const handleImageError = (e) => {
    console.error(`Failed to load image: ${e.target.src}`);
    e.target.src = 'http://localhost:5000/uploads/profile/profile.png'; // Fallback to default image
  };

  const handleBannerImageError = (e) => {
    console.error(`Failed to load banner image: ${e.target.src}`);
    e.target.src = fallbackBanner;
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar-section">
        <SideBar 
          onCategorySelect={handleCategorySelect} 
          selectedCategory={selectedCategory} 
          availableCategories={categories}
        />
      </div>

      <div className="main-content">
        <div className="banner-container">
          <img
            src={bannerImages[currentBannerIndex]}
            alt="Service Banner"
            className="service-banner"
            onError={handleBannerImageError}
          />
        </div>

        <div className="jobs-section">
          <div className="category-indicator">
            <h2>Current Category: {selectedCategory}</h2>
          </div>
          
          <div className="jobs-container">
            {loading ? (
              <p className="status-message">Loading service providers...</p>
            ) : error ? (
              <p className="error-message">Error: {error}</p>
            ) : serviceProviders.length === 0 ? (
              <p className="status-message">No service providers found in the {selectedCategory} category.</p>
            ) : (
              <div className="jobs-list">
                {serviceProviders.map((provider) => (
                  <div key={provider._id} className="job-item">
                    <div className="job-image-container">
                      <img
                        src={
                          provider.profilePic
                            ? `http://localhost:5000/${provider.profilePic}`
                            : 'http://localhost:5000/uploads/profile/profile.png'
                        }
                        alt={provider.name || 'Service Provider'}
                        className="job-image"
                        onError={handleImageError}
                      />
                    </div>
                    <div className="job-header">
                      <h3 className="job-title">{provider.name}</h3>
                    </div>
                    <div className="job-meta">
                      <span className="job-meta-item">
                        <FaTag className="meta-icon" /> {provider.category}
                      </span>
                      <span className="job-meta-item">
                        <FaMapMarkerAlt className="meta-icon" /> {provider.location || 'Location not specified'}
                      </span>
                    </div>
                    <div className="job-meta">
                      <span className="job-meta-item">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className="meta-icon"
                            style={{ color: i < (provider.rating || 0) ? 'gold' : 'grey' }}
                          />
                        ))}
                      </span>
                    </div>
                    <p className="job-description">
                      Member since {provider.memberSince || new Date(provider.createdAt).toLocaleDateString()}
                    </p>
                    <p className="job-posted-at">
                      Job Count: {provider.jobCount || 0}
                    </p>
                    <div className="job-actions">
                      <button className="action-btn" aria-label="View provider">
                        <FaEye /> View
                      </button>
                      {/* <button className="action-btn" aria-label="Comment on provider">
                        <FaComment /> Contact
                      </button>
                      <button className="action-btn" aria-label="Share provider">
                        <FaShare /> Share
                      </button> */}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewWorkers;