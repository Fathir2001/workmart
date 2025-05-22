import React, { useState } from 'react';
// Removing the navigate import since it's not being used
// import { useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import axios from 'axios';
import '../styles/Navbar2.css';

const NavBar2 = () => {
  // Removed the unused navigate variable
  const [searchQuery, setSearchQuery] = useState('');
  const [searchError, setSearchError] = useState('');

  const validCategories = [
    'Technicians',
    'AC Reports',
    'CCTV',
    'Electricians',
    'Plumbing',
    'Iron Works',
    'Wood Works',
  ];

  const handleSearch = async () => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const matchedCategory = validCategories.find(
      (category) => category.toLowerCase() === normalizedQuery
    );

    if (matchedCategory) {
      setSearchError('');
      try {
        const url = `http://localhost:5000/api/admin/public-service-providers?category=${encodeURIComponent(matchedCategory)}`;
        console.log('Fetching from:', url);

        const response = await axios.get(url);
        console.log('API Response:', response.data);

        if (!Array.isArray(response.data)) {
          throw new Error('Expected an array, received: ' + JSON.stringify(response.data));
        }

        const providers = response.data;
        if (providers.length === 0) {
          alert(`No providers found for ${matchedCategory}.`);
        } else {
          const details = providers
            .map((p) => `
              Name: ${p.name}
              Category: ${p.category}
              Location: ${p.location || 'N/A'}
              Rating: ${p.rating || 0} stars
              Job Count: ${p.jobCount || 0}
              Member Since: ${p.memberSince || new Date(p.createdAt).toLocaleDateString()}
            `)
            .join('\n\n');
          alert(`Providers for ${matchedCategory}:\n\n${details}`);
        }
        setSearchQuery('');
      } catch (err) {
        console.error('Fetch error:', err);
        alert(`Error: ${err.response ? `${err.response.status}: ${err.response.data.message || err.message}` : err.message}`);
        setSearchQuery('');
      }
    } else {
      setSearchError('Invalid category. Try Technicians, Plumbing, etc.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">Work Mart</div>
        
        <div className="navbar-links">
          <a href="/" className="nav-link">Home</a>
          <a href="/contacts" className="nav-link">Contact</a>
          <a href="/about" className="nav-link">About</a>
          <a href="/register" className="nav-link">Sign Up</a>
        </div>
        
        <div className="search-container">
          <input 
            type="text"
            placeholder="Search categories (e.g., Technicians, Plumbing)"
            className="search-input"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchError('');
            }}
            onKeyPress={handleKeyPress}
          />
          <button className="search-button" onClick={handleSearch}>
            <FiSearch className="search-icon" />
          </button>
          {searchError && <p className="search-error">{searchError}</p>}
        </div>
      </div>
    </nav>
  );
};

export default NavBar2;