import React from 'react';
import '../styles/Navbar2.css';

const NavBar2 = () => {
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
      </div>
    </nav>
  );
};

export default NavBar2;