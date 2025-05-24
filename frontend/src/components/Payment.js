import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import SideBar from './SideBar';
import '../styles/Payment.css';
import Swal from 'sweetalert2';

// Import banner images
import allServices from '../Images/banners/all-services.jpg';
import technicians from '../Images/banners/technicians.jpg';
import acReports from '../Images/banners/ac-reports.jpg';
import cctv from '../Images/banners/cctv.jpg';
import electricians from '../Images/banners/electricians.jpg';
import plumbing from '../Images/banners/plumbing.jpg';
import ironWorks from '../Images/banners/iron-works.jpg';
import woodWorks from '../Images/banners/wood-works.jpg';
import fallbackBanner from '../Images/banners/fallback-banner.png'; // Fallback image

const Payment = ({ navigateToPostJob }) => {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const navigate = useNavigate();

  const bannerImages = [
    allServices, technicians, acReports, cctv, electricians,
    plumbing, ironWorks, woodWorks,
  ];

  const categories = [
    'ALL', 'Technicians', 'AC Reports', 'CCTV', 'Electricians', 
    'Iron Works', 'Plumbing', 'Wood Works',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [bannerImages.length]);

  const handleCategorySelect = (category) => {
    if (categories.includes(category)) {
      setSelectedCategory(category);
    }
  };

  const handleNavigateToPostJob = () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!token || !user) {
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

          {/* Information about posting jobs */}
          <div className="job-posting-info">
            <h2>Looking to offer your services?</h2>
            <p>Post your job listing here to get connected with potential clients.</p>
            <p>Click the "Post Job" button to create a new job listing.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;