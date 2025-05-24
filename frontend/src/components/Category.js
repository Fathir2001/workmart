import React, { useState, useEffect, useMemo } from "react";
import axios from 'axios';
import {
  FaTools,
  FaSnowflake,
  FaVideo,
  FaBolt,
  FaWrench,
  FaHammer,
  FaTag,
  FaMapMarkerAlt,
  FaStar,
  FaEye,
  FaBuilding,
  FaMicrochip,
  FaWindowMaximize,
  FaLayerGroup,
  FaBriefcase,
  FaCar
} from "react-icons/fa";
import "../styles/Category.css";
import ServiceProviderDetailsModal from './ServiceProviderDetailsModal';

const Category = ({ onCategorySelect, compact }) => {
  const [selectedCategory, setSelectedCategory] = useState('Technicians');
  const [serviceProviders, setServiceProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);

  // Updated categories array with all services and appropriate icons
  const categories = [
    { name: "Technicians", icon: <FaTools />, value: "Technicians" },
    { name: "AC Repairs", icon: <FaSnowflake />, value: "AC Repairs" }, // Renamed from AC Reports
    { name: "CCTV", icon: <FaVideo />, value: "CCTV" },
    { name: "Electricians", icon: <FaBolt />, value: "Electricians" },
    { name: "Plumbing", icon: <FaWrench />, value: "Plumbing" },
    { name: "Iron Works", icon: <FaHammer />, value: "Iron Works" },
    { name: "Wood Works", icon: <FaHammer />, value: "Wood Works" },
    // Added missing categories
    { name: "Constructions", icon: <FaBuilding />, value: "Constructions" },
    { name: "Electronic Repairs", icon: <FaMicrochip />, value: "Electronic Repairs" },
    { name: "Glass & Aluminium", icon: <FaWindowMaximize />, value: "Glass & Aluminium" },
    { name: "Masonry", icon: <FaLayerGroup />, value: "Masonry" },
    { name: "Odd Jobs", icon: <FaBriefcase />, value: "Odd Jobs" },
    { name: "Vehicles", icon: <FaCar />, value: "Vehicles" },
  ];

  // Updated categoryMap to include all categories
  const categoryMap = useMemo(() => ({
    'Technicians': 'TECHNICIANS',
    'AC Repairs': 'AC_REPAIRS',
    'CCTV': 'CCTV',
    'Electricians': 'ELECTRICIANS',
    'Plumbing': 'PLUMBING',
    'Iron Works': 'IRON_WORKS',
    'Wood Works': 'WOOD_WORKS',
    'Constructions': 'CONSTRUCTIONS',
    'Electronic Repairs': 'ELECTRONIC_REPAIRS',
    'Glass & Aluminium': 'GLASS_ALUMINIUM',
    'Masonry': 'MASONRY',
    'Odd Jobs': 'ODD_JOBS',
    'Vehicles': 'VEHICLES',
  }), []);

  useEffect(() => {
    const fetchServiceProviders = async () => {
      try {
        setLoading(true);
        setError(null);

        // Update URL to use a public endpoint instead of admin endpoint
        const url = `http://localhost:5000/api/public/service-providers?category=${encodeURIComponent(selectedCategory)}`;
        console.log('Fetching service providers from:', url);

        const response = await axios.get(url);

        if (!Array.isArray(response.data)) {
          throw new Error('Expected an array of service providers, but received: ' + JSON.stringify(response.data));
        }

        setServiceProviders(response.data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.response ? `${err.response.status}: ${err.response.data.message || err.message}` : err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceProviders();
  }, [selectedCategory]);

  const handleCategorySelect = (categoryValue) => {
    setSelectedCategory(categoryValue);
    if (onCategorySelect) {
      onCategorySelect(categoryValue);
    }
  };

  const handleViewProviderDetails = (provider) => {
    setSelectedProvider(provider);
  };

  const handleCloseProviderModal = () => {
    setSelectedProvider(null);
  };

  // Add horizontal scrolling functionality for the categories grid
  const handleScrollLeft = () => {
    const grid = document.querySelector('.categories-grid');
    if (grid) {
      grid.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    const grid = document.querySelector('.categories-grid');
    if (grid) {
      grid.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className={`hire-category-container ${compact ? 'hire-category-compact' : ''}`}>
      <h4 className="category-title">Categories</h4>
      <div className="header-row">
        <h2 className="category-heading">What do you need to be done?</h2>
        <div className="nav-buttons">
          <button className="nav-btn" onClick={handleScrollLeft}>←</button>
          <button className="nav-btn" onClick={handleScrollRight}>→</button>
        </div>
      </div>
      
      <div className="categories-grid">
        {categories.map((cat) => (
          <div
            key={cat.value}
            className={`category-item ${selectedCategory === cat.value ? "active" : ""}`}
            onClick={() => handleCategorySelect(cat.value)}
          >
            <div className="icon">{cat.icon}</div>
            <span>{cat.name}</span>
          </div>
        ))}
      </div>
      
      <div className="category-service-providers">
        <h3 className="providers-heading">Service Providers in {selectedCategory}</h3>
        
        {loading ? (
          <p className="status-message">Loading service providers...</p>
        ) : error ? (
          <p className="error-message">Error: {error}</p>
        ) : serviceProviders.length === 0 ? (
          <p className="status-message">No service providers found in the {selectedCategory} category.</p>
        ) : (
          <div className="providers-by-category">
            {serviceProviders.map((provider) => (
              <div key={provider._id} className="provider-card">
                <div className="provider-image-container">
                  <img
                    src={
                      provider.profilePic
                        ? `http://localhost:5000/${provider.profilePic}`
                        : 'http://localhost:5000/uploads/profile/profile.png'
                    }
                    alt={provider.name || 'Service Provider'}
                    className="worker-image1"
                    onError={(e) => {
                      console.error(`Failed to load image: ${e.target.src}`);
                      e.target.src = 'http://localhost:5000/uploads/profile/profile.png';
                    }}
                  />
                </div>
                <div className="worker-info">
                  <h3 className="worker-name">{provider.name}</h3>
                  <p className="worker-category">
                    <FaTag className="meta-icon" /> {provider.category}
                  </p>
                  <div className="worker-location">
                    <FaMapMarkerAlt className="meta-icon" /> {provider.location || 'Location not specified'}
                  </div>
                  <div className="worker-stats">
                    <div className="worker-rating">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          style={{ color: i < (provider.rating || 0) ? 'gold' : 'grey', marginRight: '2px' }}
                        />
                      ))}
                    </div>
                    <div className="worker-jobs">
                      Jobs: {provider.jobCount || 0}
                    </div>
                  </div>
                  <p className="worker-since">
                    Member since {provider.memberSince || new Date(provider.createdAt).toLocaleDateString()}
                  </p>
                  <div className="worker-action-buttons">
                    <button 
                      className="view-provider-btn"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click from triggering
                        handleViewProviderDetails(provider);
                      }}
                    >
                      <FaEye /> View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedProvider && (
        <ServiceProviderDetailsModal 
          provider={selectedProvider} 
          onClose={handleCloseProviderModal}
        />
      )}
    </div>
  );
};

export default Category;