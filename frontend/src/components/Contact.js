import React from "react";
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import "../styles/Contact.css";
import contactImage from "../Images/outstretched-stationary-portrait-stylish-skill 1.png"; 

const Contact = () => {
  return (
    <div className="contact-container">
      <div className="contact-image">
        <img src={contactImage} alt="Contact" />
      </div>
      <div className="contact-details">
        <div className="contact-box">
          <FaPhoneAlt className="contact-icon" />
          <div>
            <h3>Call To Us</h3>
            <p>We are available 24/7, 7 days a week.</p>
            <p>Phone: +94 778353336</p>
          </div>
        </div>
        <div className="contact-box">
          <FaEnvelope className="contact-icon" />
          <div>
            <h3>Write To Us</h3>
            <p>Fill out our form and we will contact you within 24 hours.</p>
            <p>Emails: customer@exclusive.com</p>
            <p>support@exclusive.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
