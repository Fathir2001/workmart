import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMoneyBillWave, FaTag, FaEye } from 'react-icons/fa';
import SideBar from './SideBar';
import '../styles/Payment.css';
import Swal from 'sweetalert2';

// Import banner images from src/images/banners/
import allServices from '../Images/banners/all-services.jpg';
import technicians from '../Images/banners/technicians.jpg';
import acReports from '../Images/banners/ac-reports.jpg';
import cctv from '../Images/banners/cctv.jpg';
import electricians from '../Images/banners/electricians.jpg';
import plumbing from '../Images/banners/plumbing.jpg';
import ironWorks from '../Images/banners/iron-works.jpg';
import woodWorks from '../Images/banners/wood-works.jpg';
import fallbackBanner from '../Images/banners/fallback-banner.png'; // Fallback image

const Payment = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [allJobs, setAllJobs] = useState([]); // Store all jobs for client-side filtering

  const navigate = useNavigate();

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

  const categories = [
    'ALL',
    'Technicians',
    'AC Reports',
    'CCTV',
    'Electricians',
    'Iron Works',
    'Plumbing',
    'Wood Works',
  ];

  // Map the UI-friendly category names to backend category values
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

  // Fetch all jobs once on component mount
  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('http://localhost:5000/api/jobs');

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Fetched All Jobs:', data);

        // Ensure the response is an array
        if (!Array.isArray(data)) {
          throw new Error('Expected an array of jobs, but received: ' + JSON.stringify(data));
        }

        setAllJobs(data);
        setJobs(data); // Initially display all jobs
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAllJobs();
  }, []);

  // Filter jobs when the selected category changes
  useEffect(() => {
    if (allJobs.length === 0) return; // Skip if no jobs loaded yet
    
    setLoading(true);
    
    try {
      // If "ALL" is selected, show all jobs
      if (selectedCategory === 'ALL') {
        setJobs(allJobs);
      } else {
        // Filter jobs client-side based on selected category
        const backendCategory = categoryMap[selectedCategory];
        const filteredJobs = allJobs.filter(job => 
          job.category === backendCategory || 
          job.category === selectedCategory
        );
        setJobs(filteredJobs);
      }
    } catch (err) {
      console.error('Filtering error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, allJobs, categoryMap]);

  const handleCategorySelect = (category) => {
    if (categories.includes(category)) {
      console.log(`Selecting category: ${category}`);
      setSelectedCategory(category);
    } else {
      console.warn(`Invalid category selected: ${category}`);
    }
  };

  const handleNavigateToPostJob = () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!token || !user) {
      // Store intended destination in localStorage before redirecting to login
      localStorage.setItem('redirectAfterLogin', '/postjob');
      
      Swal.fire({
        title: 'Authentication Required',
        text: 'Please login to post a job',
        icon: 'warning',
        confirmButtonText: 'Login Now',
        showCancelButton: true,
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login');
        }
      });
    } else {
      navigate('/postjob');
    }
  };

  const handleImageError = (e) => {
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
            onError={handleImageError}
          />
        </div>

        <div className="jobs-section">
          <button className="post-job-btn" onClick={handleNavigateToPostJob} aria-label="Post a job">
            <span className="post-job-text">Post Job</span>
          </button>

          <div className="jobs-container">
            {loading ? (
              <p className="status-message">Loading jobs...</p>
            ) : error ? (
              <p className="error-message">Error: {error}</p>
            ) : jobs.length === 0 ? (
              <p className="status-message">No jobs found in the {selectedCategory} category.</p>
            ) : (
              <div className="jobs-list">
                {jobs.map((job) => (
                  <div key={job._id} className="job-item">
                    {job.image && (
                      <div className="job-image-container">
                        <img 
                          src={job.image} 
                          alt={job.title} 
                          className="job-image" 
                          onError={(e) => {
                            console.error(`Failed to load job image: ${e.target.src}`);
                            e.target.src = fallbackBanner;
                          }}
                        />
                      </div>
                    )}
                    <div className="job-header">
                      <h3 className="job-title">{job.title}</h3>
                    </div>
                    <div className="job-meta">
                      {job.salary && (
                        <span className="job-meta-item">
                          <FaMoneyBillWave className="meta-icon" /> ${job.salary}
                        </span>
                      )}
                      <span className="job-meta-item">
                        <FaTag className="meta-icon" /> {job.category}
                      </span>
                    </div>
                    <p className="job-description">{job.description}</p>
                    <p className="job-posted-at">
                      Posted by {job.postedBy?.name || 'Unknown User'} on {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                    <div className="job-actions">
                      <button className="action-btn" aria-label="View job">
                        <FaEye /> View (0)
                      </button>
                      {/* <button className="action-btn" aria-label="Comment on job">
                        <FaComment /> Comment (0)
                      </button>
                      <button className="action-btn" aria-label="Share job">
                        <FaShare /> Share (0)
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

export default Payment;