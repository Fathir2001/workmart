import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { FaTag, FaMapMarkerAlt, FaEye, FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
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
  const [allServiceProviders, setAllServiceProviders] = useState([]);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [providersPerPage] = useState(4); // Changed from 8 to 4 providers per page
  const [filteredProviders, setFilteredProviders] = useState([]);

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
      let filtered = [];
      
      // If "ALL" is selected, show all service providers
      if (selectedCategory === 'ALL') {
        filtered = allServiceProviders;
      } else {
        // Filter providers by selected category
        const backendCategory = categoryMap[selectedCategory];
        
        filtered = allServiceProviders.filter(provider => {
          return (
            provider.category === backendCategory || 
            provider.category === selectedCategory ||
            (provider.category && 
              (provider.category.toUpperCase() === backendCategory || 
               provider.category.toUpperCase() === selectedCategory.toUpperCase()))
          );
        });
      }
      
      // Save filtered results and reset to first page
      setFilteredProviders(filtered);
      setCurrentPage(1);
    } catch (err) {
      console.error('Filtering error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, allServiceProviders, categoryMap]);

  // Calculate current providers to display based on pagination
  useEffect(() => {
    // Get current providers for this page
    const indexOfLastProvider = currentPage * providersPerPage;
    const indexOfFirstProvider = indexOfLastProvider - providersPerPage;
    const currentProviders = filteredProviders.slice(indexOfFirstProvider, indexOfLastProvider);
    
    setServiceProviders(currentProviders);
  }, [currentPage, filteredProviders, providersPerPage]);

  // Pagination controls
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredProviders.length / providersPerPage);

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
    <div className="hire-workers-container">
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
              <p className="hire-results-count">
                Showing {serviceProviders.length} of {filteredProviders.length} service providers
              </p>
            </div>
            
            <div className="jobs-container">
              {loading ? (
                <p className="status-message">Loading service providers...</p>
              ) : error ? (
                <p className="error-message">Error: {error}</p>
              ) : serviceProviders.length === 0 ? (
                <p className="status-message">No service providers found in the {selectedCategory} category.</p>
              ) : (
                <>
                  <div className="hire-workers-grid">
                    {serviceProviders.map((provider) => (
                      <div key={provider._id} className="hire-worker-card">
                        <div className="hire-worker-image-container">
                          <img
                            src={
                              provider.profilePic
                                ? provider.profilePic.startsWith('http')
                                  ? provider.profilePic
                                  : `http://localhost:5000/${provider.profilePic.replace(/^\/+/, '')}`
                                : 'http://localhost:5000/uploads/profile/profile.png'
                            }
                            alt={provider.name || 'Service Provider'}
                            className="hire-worker-image"
                            onError={(e) => {
                              console.error(`Failed to load image: ${e.target.src}`);
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                            }}
                          />
                        </div>
                        <div className="hire-worker-info">
                          <h3 className="hire-worker-name">{provider.name}</h3>
                          <div className="hire-worker-category">
                            <FaTag className="hire-meta-icon" /> {provider.category}
                          </div>
                          <div className="hire-worker-location">
                            <FaMapMarkerAlt className="hire-meta-icon" /> {provider.location || 'Location not specified'}
                          </div>
                          <div className="hire-worker-stats">
                            <div className="hire-worker-rating">
                              {[...Array(5)].map((_, i) => (
                                <FaStar
                                  key={i}
                                  className="hire-meta-icon"
                                  style={{ color: i < (provider.rating || 0) ? '#f1c40f' : '#ddd' }}
                                />
                              ))}
                            </div>
                            <div className="hire-worker-jobs">
                              Jobs: {provider.jobCount || 0}
                            </div>
                          </div>
                        </div>
                        <div className="hire-worker-actions">
                          <button className="hire-action-btn" aria-label="View provider">
                            <FaEye /> View
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="hire-pagination">
                      <button 
                        onClick={prevPage} 
                        className="hire-pagination-btn"
                        disabled={currentPage === 1}
                      >
                        <FaChevronLeft /> Prev
                      </button>
                      
                      <div className="hire-pagination-numbers">
                        {[...Array(totalPages)].map((_, index) => {
                          // Only show current page, first, last, and a few surrounding pages
                          const pageNum = index + 1;
                          if (
                            pageNum === 1 || 
                            pageNum === totalPages || 
                            (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                          ) {
                            return (
                              <button 
                                key={pageNum}
                                onClick={() => paginate(pageNum)}
                                className={`hire-pagination-num ${currentPage === pageNum ? 'active' : ''}`}
                              >
                                {pageNum}
                              </button>
                            );
                          } else if (
                            (pageNum === currentPage - 2 && currentPage > 3) || 
                            (pageNum === currentPage + 2 && currentPage < totalPages - 2)
                          ) {
                            return <span key={pageNum} className="hire-pagination-ellipsis">...</span>;
                          } else {
                            return null;
                          }
                        })}
                      </div>
                      
                      <button 
                        onClick={nextPage} 
                        className="hire-pagination-btn"
                        disabled={currentPage === totalPages}
                      >
                        Next <FaChevronRight />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewWorkers;