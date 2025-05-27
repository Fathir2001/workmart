import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import '../styles/Navbar2.css';
import Logo from '../Images/workmart_logo.png'

const NavBar2 = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const profileIconRef = useRef(null);
  const navigate = useNavigate();

  // Handle outside clicks to close the dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      // Close dropdown if click is outside dropdown and not on the profile icon
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        profileIconRef.current &&
        !profileIconRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    }

    // Add event listener when dropdown is shown
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    // Cleanup the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  // Check login status whenever the component renders
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };
    
    // Check on initial load
    checkLoginStatus();
    
    // Set up event listener for storage changes
    window.addEventListener('storage', checkLoginStatus);
    
    // Custom event listener for login/logout
    window.addEventListener('authChange', checkLoginStatus);
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('authChange', checkLoginStatus);
    };
  }, []);

  const handleSignOut = () => {
    // Clear user data and token from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Update state
    setIsLoggedIn(false);
    setShowDropdown(false);
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('authChange'));
    
    // Navigate to home
    navigate('/');
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const navigateToProfile = () => {
    navigate('/profile');
    setShowDropdown(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <img src={Logo} alt="Work Mart Logo" className="navbar-logo" />
          Work Mart
        </div>
        
        <div className="navbar-links">
          <a href="/" className="nav-link">Home</a>
          <a href="/contacts" className="nav-link">Contact</a>
          <a href="/about" className="nav-link">About</a>
          
          {isLoggedIn ? (
            <div className="profile-container1">
              <div 
                ref={profileIconRef}
                className="profile-icon" 
                onClick={toggleDropdown}
              >
                <FaUser />
              </div>
              {showDropdown && (
                <div ref={dropdownRef} className="profile-dropdown">
                  <div className="dropdown-item" onClick={navigateToProfile}>
                    <FaUser className="dropdown-icon" /> Profile
                  </div>
                  <div className="dropdown-item" onClick={handleSignOut}>
                    <FaSignOutAlt className="dropdown-icon" /> Sign Out
                  </div>
                </div>
              )}
            </div>
          ) : (
            <a href="/register" className="nav-link">Sign Up</a>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar2;