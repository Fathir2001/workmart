import React from 'react';
import '../styles/Introduction.css';
import sideImage from '../Images/Side Image.jpg'; // Update path as needed
import { useNavigate } from 'react-router-dom';

const Introduction = () => {
  const navigate = useNavigate();

  const handleWorkClick = () => {
    navigate('/work');
  };

  const handleHireClick = () => {
    navigate('/hire');
  };

  return (
    <div className="introduction-section">
      <div className="introduction-content">
        <div className="introduction-text">
          <h1 className="introduction-title">Any Job</h1>
          <h2 className="introduction-subtitle">Any Time</h2>
          <h2 className="introduction-subtitle">Any where</h2>

          <p className="introduction-description">
             your one-stop platform connecting skilled service providers with customers in need of trusted services. Whether you're looking for a reliable electrician, a professional cleaner, a personal tutor, or any other local expert, WorkMart makes it easy to find and hire the right person for the job. Our user-friendly interface ensures smooth communication, secure bookings, and real-time updates — making everyday tasks simpler and more convenient for everyone.
          </p>

          <div className="introduction-buttons">
            <button className="intro-button work-button" onClick={handleWorkClick}>
              I want to work
            </button>
            <button className="intro-button hire-button" onClick={handleHireClick}>
              I want to hire
            </button>
          </div>
        </div>

        <div className="introduction-image">
          <img src={sideImage} alt="Introduction visual" className="side-image" />
        </div>
      </div>
    </div>
  );
};

export default Introduction;