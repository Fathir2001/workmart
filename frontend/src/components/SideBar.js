import React from 'react';
import '../styles/SideBar.css'; // Adjust path as needed

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
              {category}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SideBar;