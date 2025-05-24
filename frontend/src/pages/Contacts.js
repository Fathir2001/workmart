import React, { useState } from 'react';
import '../styles/Contacts.css';
import { FaPhone, FaEnvelope, FaPaperPlane } from 'react-icons/fa';
import Footer from '../components/Footer';
import axios from 'axios';

const Contacts = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', { name, email, phone, message });

    try {
      const response = await axios.post('http://localhost:5000/api/contacts', {
        name,
        email,
        message: `${message} (Phone: ${phone})`,
      }, {
        headers: { 'Content-Type': 'application/json' },
      });

      console.log('Backend response:', response.data);

      setSuccess('Message sent successfully!');
      setError(null);

      // Delay form reset to ensure the user sees the success message
      setTimeout(() => {
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
      }, 2000);
    } catch (err) {
      console.error('Error submitting form:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to send message';
      setError(errorMessage);
      setSuccess(null);
    }
  };

  return (
    <div>
      <div className="contacts-container">
        <div className="breadcrumb">Home / Contact</div>

        <div className="contact-content">
          <div className="contact-info-column">
            <div className="contact-info">
              <div className="contact-title">
                <div className="icon-circle">
                  <FaPhone className="contact-icon" />
                </div>
                <h3>Call To Us</h3>
              </div>
              <p>We are available 24/7, 7 days a week.</p>
              <div className="contact-detail">
                <span>Phone: +94 778353336</span>
              </div>
            </div>

            <div className="contact-info">
              <div className="contact-title">
                <div className="icon-circle">
                  <FaEnvelope className="contact-icon" />
                </div>
                <h3>Write To Us</h3>
              </div>
              <p>Fill out our form and we will contact you within 24 hours.</p>
              <div className="contact-detail">
                <span>Email: customw@exclusive.com</span>
              </div>
              <div className="contact-detail">
                <span>Email: support@exclusive.com</span>
              </div>
            </div>
          </div>

          <div className="contact-form">
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Your Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Your Email *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Your Phone *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Your Message</label>
                <textarea
                  rows="5"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
              </div>

              <button type="submit" className="send-button">
                <FaPaperPlane className="send-icon" />
                Send Message
              </button>
            </form>

            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
            {success && <p style={{ color: 'green', marginTop: '10px' }}>{success}</p>}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contacts;
