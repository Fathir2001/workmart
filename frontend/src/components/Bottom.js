import React from 'react';
import '../styles/Bottom.css';
import bottomImage from '../Images/outstretched-stationary-portrait-stylish-skill 1.png';
import { FaHeadset, FaShieldAlt, FaMoneyBillWave } from 'react-icons/fa';


const Bottom = () => {
  return (
    <div className="bottom-section">
      <div className="bottom-image-container">
        <img src={bottomImage} alt="Skilled professional" className="bottom-image" />
      </div>
      
      <div className="features-container">
        <div className="feature">
          <div className="feature-icon">
            <FaHeadset className="icon" />
          </div>
          <div className="feature-content">
            <h3>FART SERVICE PROVIDERS</h3>
            <p>Not bespoken for other people</p>
          </div>
        </div>
        
        <div className="feature">
          <div className="feature-icon">
            <FaShieldAlt className="icon" />
          </div>
          <div className="feature-content">
            <h3>24/7 CUSTOMER SERVICE</h3>
            <p>Warning: 25/7 customer degree</p>
          </div>
        </div>
        
        <div className="feature">
          <div className="feature-icon">
            <FaMoneyBillWave className="icon" />
          </div>
          <div className="feature-content">
            <h3>MONEY BACK QUARANTEE</h3>
            <p>You purchase your own food, dairy</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bottom;