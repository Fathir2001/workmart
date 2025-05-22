import React, { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import '../styles/Comments.css';
import profileImage from '../Images/Frame 611.png'; // Update this path

const Comments = () => {
  const comments = [
    {
      name: "Byrd Gomez",
      text: "WorkMart has been a game-changer for me. I found a reliable electrician for my home repairs in just a few clicks. Highly recommend this platform!"
    },
    {
      name: "Sofia Patel",
      text: "I needed a plumber urgently, and WorkMart connected me with a professional who did an amazing job. The platform is so easy to use!"
    },
    {
      name: "Alex Johnson",
      text: "WorkMart has completely transformed how I find service providers. The platform is easy to use and the quality of professionals is outstanding."
    },
    {
      name: "Maria Garcia",
      text: "I've been using WorkMart for all my home maintenance needs. The painters I found through the platform did an amazing job on my house."
    },
    {
      name: "Ethan Brooks",
      text: "As a contractor, WorkMart has helped me find consistent work. The job postings are clear, and the platform makes communication with clients seamless."
    },
    {
      name: "Aisha Khan",
      text: "I hired a technician for my AC repair through WorkMart, and the service was top-notch. I’ll definitely use this platform again!"
    },
    {
      name: "Liam Carter",
      text: "WorkMart’s interface is intuitive, and I love how I can filter jobs by category. Found a great CCTV installer for my office in no time!"
    },
    {
      name: "Nia Thompson",
      text: "The house cleaning service I booked through WorkMart was exceptional. The professionals were punctual and thorough. Five stars!"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextComment = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + 2 >= comments.length ? 0 : prevIndex + 2
    );
  };

  const prevComment = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex - 2 < 0 ? comments.length - (comments.length % 2 || 2) : prevIndex - 2
    );
  };

  // Auto-cycle comments every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextComment(); // Call nextComment to cycle to the next set of comments
    }, 3000); // 3 seconds

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, []); // Empty dependency array since nextComment doesn't depend on state

  const visibleComments = comments.slice(currentIndex, currentIndex + 2);

  return (
    <div className="comments-section">
      <div className="comments-header">
        <h1 className="comments-title">See how others are using WorkMart</h1>
        <div className="comment-navigation">
          <button onClick={prevComment} className="nav-button">
            <FiChevronLeft className="nav-icon" />
          </button>
          <button onClick={nextComment} className="nav-button">
            <FiChevronRight className="nav-icon" />
          </button>
        </div>
      </div>
      
      <div className="comments-row">
        {visibleComments.map((comment, index) => (
          <div key={index} className="comment-card">
            <div className="comment-header">
              <img src={profileImage} alt="Profile" className="comment-profile" />
              <h2 className="comment-name">{comment.name}</h2>
            </div>
            <p className="comment-text">{comment.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;