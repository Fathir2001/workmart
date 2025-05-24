import React from 'react';
import '../styles/SideBar.css';

// Define category icons
const categoryIcons = {
  'ALL': '🔍',
  'Technicians': '🛠️',
  'AC Repairs': '❄️',
  'CCTV': '📹',
  'Electricians': '⚡',
  'Plumbing': '🚿',
  'Iron Works': '⚙️',
  'Wood Works': '🪓',
  'Constructions': '🏗️',
  'Electronic Repairs': '📱',
  'Glass & Aluminium': '🪟',
  'Masonry': '🧱',
  'Odd Jobs': '📋',
  'Vehicles': '🚗'
};

// Updated categories array to match all service options
const categories = [
  'ALL',
  'Technicians',
  'AC Repairs', // Changed from 'AC Reports' to match dropdown
  'CCTV',
  'Electricians',
  'Plumbing',
  'Iron Works',
  'Wood Works',
  'Constructions',
  'Electronic Repairs',
  'Glass & Aluminium',
  'Masonry',
  'Odd Jobs',
  'Vehicles'
];

const SideBar = ({ onCategorySelect, selectedCategory }) => {
  const handleCategoryClick = (categoryName) => {
    onCategorySelect(categoryName); // Call the prop function to notify Payment.js
  };

  return (
    <div className="sidebar">
      <div className="sidebar-container">
        <div className="sidebar-header">
          <h2 className="sidebar-title">Categories</h2>
        </div>
        <div className="category-title">Filter by Category</div>
        <ul className="menu-items">
          {categories.map((category) => (
            <li
              key={category}
              className={`menu-item ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => handleCategoryClick(category)}
            >
              <span className="category-icon">{categoryIcons[category] || '👷'}</span>
              {category}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SideBar;