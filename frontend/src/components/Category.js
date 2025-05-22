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
  FaStar
} from "react-icons/fa";
import "../styles/Category.css";

const Category = ({ onCategorySelect }) => {
  const [selectedCategory, setSelectedCategory] = useState('Technicians');
  const [serviceProviders, setServiceProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const categories = [
    { name: "Technicians", icon: <FaTools />, value: "Technicians" },
    { name: "AC Reports", icon: <FaSnowflake />, value: "AC Reports" },
    { name: "CCTV", icon: <FaVideo />, value: "CCTV" },
    { name: "Electricians", icon: <FaBolt />, value: "Electricians" },
    { name: "Plumbing", icon: <FaWrench />, value: "Plumbing" },
    { name: "Iron Works", icon: <FaHammer />, value: "Iron Works" },
    { name: "Wood Works", icon: <FaHammer />, value: "Wood Works" },
  ];

  // Using useMemo to memoize the categoryMap to prevent it from being recreated on each render
  const categoryMap = useMemo(() => ({
    'Technicians': 'TECHNICIANS',
    'AC Reports': 'AC_REPORTS',
    'CCTV': 'CCTV',
    'Electricians': 'ELECTRICIANS',
    'Plumbing': 'PLUMBING',
    'Iron Works': 'IRON_WORKS',
    'Wood Works': 'WOOD_WORKS',
  }), []);

  useEffect(() => {
    const fetchServiceProviders = async () => {
      try {
        setLoading(true);
        setError(null);

        const backendCategory = categoryMap[selectedCategory];
        const url = `http://localhost:5000/api/admin/public-service-providers?category=${encodeURIComponent(backendCategory)}`;
        console.log('Fetching service providers from:', url);

        const response = await axios.get(url);

        if (!Array.isArray(response.data)) {
          throw new Error('Expected an array of service providers, but received: ' + JSON.stringify(response.data));
        }

        setServiceProviders(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.response ? `${err.response.status}: ${err.response.data.message || err.message}` : err.message);
        setLoading(false);
      }
    };

    fetchServiceProviders();
  }, [selectedCategory, categoryMap]);

  const handleCategorySelect = (categoryValue) => {
    setSelectedCategory(categoryValue);
    if (onCategorySelect) {
      onCategorySelect(categoryValue);
    }
  };

  return (
    <div className="category-container">
      <h4 className="category-title">Categories</h4>
      <div className="header-row">
        <h2 className="category-heading">What do you need to be done?</h2>
        <div className="nav-buttons">
          <button className="nav-btn">←</button>
          <button className="nav-btn">→</button>
        </div>
      </div>
      <div className="category-list">
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
      <div className="providers-section">
        {loading ? (
          <p className="status-message">Loading service providers...</p>
        ) : error ? (
          <p className="error-message">Error: {error}</p>
        ) : serviceProviders.length === 0 ? (
          <p className="status-message">No service providers found in the {selectedCategory} category.</p>
        ) : (
          <div className="providers-list">
            {serviceProviders.map((provider) => (
              <div key={provider._id} className="provider-item">
                <div className="provider-image-container">
                  <img
                    src={
                      provider.profilePic
                        ? `http://localhost:5000/${provider.profilePic}`
                        : 'http://localhost:5000/uploads/profile/profile.png'
                    }
                    alt={provider.name || 'Service Provider'}
                    className="provider-image"
                    onError={(e) => {
                      console.error(`Failed to load image: ${e.target.src}`);
                      e.target.src = 'http://localhost:5000/uploads/profile/profile.png';
                    }}
                  />
                </div>
                <div className="provider-header">
                  <h3 className="provider-title">{provider.name}</h3>
                </div>
                <div className="provider-meta">
                  <span className="provider-meta-item">
                    <FaTag className="meta-icon" /> {provider.category}
                  </span>
                  <span className="provider-meta-item">
                    <FaMapMarkerAlt className="meta-icon" /> {provider.location || 'Location not specified'}
                  </span>
                </div>
                <div className="provider-meta">
                  <span className="provider-meta-item">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className="meta-icon"
                        style={{ color: i < (provider.rating || 0) ? 'gold' : 'grey' }}
                      />
                    ))}
                  </span>
                </div>
                <p className="provider-description">
                  Member since {provider.memberSince || new Date(provider.createdAt).toLocaleDateString()}
                </p>
                <p className="provider-job-count">
                  Job Count: {provider.jobCount || 0}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Category;