import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/JobList.css';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/jobs');
        setJobs(response.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch jobs');
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="job-list">
      {error && <p className="error">{error}</p>}
      {jobs.length === 0 && !error && <p>No jobs available</p>}
      {jobs.map((job) => (
        <div key={job._id} className="job-card">
          <div className="job-header">
            <img src="https://via.placeholder.com/40" alt="User" className="user-avatar" />
            <div className="job-meta">
              <h3>{job.postedBy?.email || 'Anonymous'}</h3>
              <p>{new Date().toLocaleDateString()} • 1M ago</p>
            </div>
            <span className="job-status">NEW</span>
          </div>
          <h2 className="job-title">{job.title}</h2>
          <div className="job-details">
            <span className="job-category">{job.category || 'Plumbing'}</span>
            <span className="job-price">{job.salary ? `Rs.${job.salary}` : 'Not mentioned'}</span>
            <span className="job-location">{job.location}</span>
          </div>
          <p className="job-description">{job.description}</p>
          <div className="job-actions">
            <button className="action-btn">View</button>
            <button className="action-btn">Comment</button>
            <button className="action-btn">Share</button>
            <span className="applied-count">1 Applied</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JobList;