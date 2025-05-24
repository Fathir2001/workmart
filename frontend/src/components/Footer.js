import React from 'react';
import { FaFacebookF, FaLinkedinIn, FaInstagram } from 'react-icons/fa';
import '../styles/Footer.css';


const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-row">
          <div className="footer-brand">
            <h2 className="footer-logo">Work Mart</h2>
          </div>

          <div className="footer-links-group">
            <div className="footer-links-column">
              <h3 className="footer-title">Menu</h3>
              <ul className="footer-list">
                <li><a href="postjob">Jobs</a></li>
                <li><a href="hire">Service Providers</a></li>
                <li><a href="work">How it works?</a></li>
                <li><a href="about">About us</a></li>
              </ul>
            </div>

            <div className="footer-links-column">
              <h3 className="footer-title">Account</h3>
              <ul className="footer-list">
                <li><a href="profile">My Account</a></li>
                <li><a href="register">Login / Register</a></li>
              </ul>
            </div>

            <div className="footer-links-column">
              <h3 className="footer-title">Quick Link</h3>
              <ul className="footer-list">
                <li><a href="faq">FAQ</a></li>
                <li><a href="contacts">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-social-group">
            <div className="footer-social">
              <a href="https://www.facebook.com/mohamed.asnaf.147723" className="social-icon"><FaFacebookF /></a>
              <a href="https://www.linkedin.com/in/mohamed-asnaf-621b852a1/" className="social-icon"><FaLinkedinIn /></a>
              {/* <a href="#" className="social-icon"><FaTwitter /></a> */}
              <a href="https://www.instagram.com/itz_asnaf/" className="social-icon"><FaInstagram /></a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© Copyright Asnaf_2025. All right reserved</p>
      </div>
    </footer>
  );
};

export default Footer;