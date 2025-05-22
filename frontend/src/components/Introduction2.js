import React from 'react';
import { FaEdit, FaCheckCircle, FaSearchDollar } from 'react-icons/fa';
import '../styles/Introduction2.css';

const Introduction2 = () => {
  return (
    <div className="intro2-section">
      <div className="intro2-container">
        <div className="intro2-card">
          <div className="intro2-icon">
            <FaEdit className="icon" />
          </div>
          <h3 className="intro2-title">Post your job</h3>
          <p className="intro2-description">
            Tell us what you need. It's FREE to post a job
          </p>
        </div>

        <div className="intro2-card">
          <div className="intro2-icon">
            <FaCheckCircle className="icon" />
          </div>
          <h3 className="intro2-title">Get it done</h3>
          <p className="intro2-description">
            Choose the right person for your job and get it done.
          </p>
        </div>

        <div className="intro2-card">
          <div className="intro2-icon">
            <FaSearchDollar className="icon" />
          </div>
          <h3 className="intro2-title">Review offers</h3>
          <p className="intro2-description">
            Get offers from trusted service providers and view their profiles
          </p>
        </div>
      </div>
    </div>
  );
};

export default Introduction2;