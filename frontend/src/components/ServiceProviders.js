import React from 'react';
import { FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import '../styles/ServiceProviders.css';
import emmaWatson from '../Images/Frame 875.png';
import willSmith from '../Images/Frame 876.png';
import { useNavigate } from "react-router-dom";


const ServiceProviders = () => {

  const navigate = useNavigate();

  return (
    <div className="service-providers-section">
      <div className="providers-container">
        <div className="providers-content">
          <h2 className="providers-title">Meet the best</h2>
          <h1 className="providers-title">service Providers</h1>
          <p className="providers-description">
            Register with us today, start doing jobs and get paid
          </p>
          <button className="register-button" onClick={() => navigate("/register")} >Register Now</button>
        </div>

        <div className="providers-profiles">
          <div className="provider-card">
            <img src={emmaWatson} alt="Emma Watson" className="provider-image" />
            <h3 className="provider-name">Emma Watson</h3>
            <div className="social-icons">
              <a href="#" className="social-icon"><FaTwitter /></a>
              <a href="#" className="social-icon"><FaInstagram /></a>
              <a href="#" className="social-icon"><FaLinkedin /></a>
            </div>
          </div>

          <div className="provider-card">
            <img src={willSmith} alt="Will Smith" className="provider-image" />
            <h3 className="provider-name">Will Smith</h3>
            <div className="social-icons">
              <a href="#" className="social-icon"><FaTwitter /></a>
              <a href="#" className="social-icon"><FaInstagram /></a>
              <a href="#" className="social-icon"><FaLinkedin /></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceProviders;