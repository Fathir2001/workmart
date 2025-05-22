import React from 'react';
import '../styles/About.css';
import aboutImage from '../Images/Side Image.png';
import Contact from '../components/Contact';
import Comments from '../components/Comments';
import Footer from '../components/Footer';



const About = () => {
  return (
    <div>
    <div className="about-container">
      <div className="about-content-section">
        <h1 className="about-title">WHO WE ARE?</h1>
        
        <div className="about-paragraphs">
       
  <p>
    Welcome to WorkMart, your one-stop platform for finding reliable service providers and job opportunities! At WorkMart, we believe in simplifying the way you connect with skilled professionals—whether you need a plumber, electrician, technician, or any other service. Our mission is to empower individuals and businesses by bridging the gap between talent and opportunity with ease and efficiency.
  </p>
  <p>
    Founded with a vision to transform the service industry, WorkMart offers a seamless experience to browse, post, and manage jobs across various categories. From house painting to CCTV installation, we’ve got you covered. Our platform is designed to save you time, provide transparency, and ensure quality service—every time.
  </p>
  <p>
    Why choose WorkMart? We prioritize your needs by offering a user-friendly interface, real-time job updates, and a community-driven approach to connect you with trusted professionals. Whether you're a homeowner seeking help or a skilled worker looking for opportunities, WorkMart is here to make it happen.
  </p>
  <p>
    Join us today and experience the future of service connections—where your needs meet the right talent, effortlessly.
  </p>
        </div>
      </div>

      <div className="about-image-section">
        <img src={aboutImage} alt="About Exclusive" className="about-image" />
      </div>
    </div>
<Comments/>
<Contact/>
<Footer/>
    </div>
    
  );
};

export default About;