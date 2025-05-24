import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaMoneyBillWave, FaTag, FaMapMarkerAlt, FaEye, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import '../styles/Hire.css';
import fallbackBanner from '../Images/banners/fallback-banner.png';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allJobs, setAllJobs] = useState([]);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(4); // Changed from 6 to 4 jobs per page

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/jobs');
        console.log('Fetched jobs:', response.data);
        setAllJobs(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError(err.message || 'Failed to fetch jobs');
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Get current jobs for this page
  useEffect(() => {
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = allJobs.slice(indexOfFirstJob, indexOfLastJob);
    setJobs(currentJobs);
  }, [currentPage, allJobs, jobsPerPage]);

  // Pagination controls
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  
  // Calculate total pages
  const totalPages = Math.ceil(allJobs.length / jobsPerPage);

  // Helper function to get user display name
  const getUserDisplayName = (postedBy) => {
    if (!postedBy) return 'Unknown User';
    if (typeof postedBy === 'string') return 'User #' + postedBy.substring(0, 6);
    if (postedBy.name) return postedBy.name;
    if (postedBy.email) return postedBy.email;
    return 'Unknown User';
  };

  // Truncate text to specified length
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="hire-jobs-container">
      {loading ? (
        <p className="hire-status-message">Loading jobs...</p>
      ) : error ? (
        <p className="hire-error-message">Error: {error}</p>
      ) : jobs.length === 0 ? (
        <p className="hire-status-message">No jobs found.</p>
      ) : (
        <>
          <p className="hire-results-count">
            Showing {jobs.length} of {allJobs.length} available jobs
          </p>
          
          <div className="hire-jobs-grid">
            {jobs.map((job) => (
              <div key={job._id} className="hire-job-card">
                <div className="hire-job-image-container">
                  <img 
                    src={
                      job.image
                        ? job.image.startsWith('http')
                          ? job.image
                          : `http://localhost:5000/${job.image.replace(/^\/+/, '')}`
                        : fallbackBanner
                    }
                    alt={job.title} 
                    className="hire-job-image" 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = fallbackBanner;
                    }}
                  />
                </div>
                <div className="hire-job-header">
                  <h3 className="hire-job-title" title={job.title}>
                    {truncateText(job.title, 40)}
                  </h3>
                </div>
                <div className="hire-job-meta">
                  {job.salary && (
                    <span className="hire-job-meta-item">
                      <FaMoneyBillWave className="hire-meta-icon" /> Rs. {job.salary}
                    </span>
                  )}
                  <span className="hire-job-meta-item">
                    <FaTag className="hire-meta-icon" /> {job.category}
                  </span>
                  {job.location && (
                    <span className="hire-job-meta-item">
                      <FaMapMarkerAlt className="hire-meta-icon" /> {job.location}
                    </span>
                  )}
                </div>
                <p className="hire-job-description">{truncateText(job.description, 100)}</p>
                <p className="hire-job-posted-at">
                  Posted by {getUserDisplayName(job.postedBy)} on {new Date(job.createdAt).toLocaleDateString()}
                </p>
                <div className="hire-job-actions">
                  <button className="hire-action-btn" aria-label="View job details">
                    <FaEye /> View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="hire-pagination">
              <button 
                onClick={prevPage} 
                className="hire-pagination-btn"
                disabled={currentPage === 1}
              >
                <FaChevronLeft /> Prev
              </button>
              
              <div className="hire-pagination-numbers">
                {[...Array(totalPages)].map((_, index) => {
                  const pageNum = index + 1;
                  if (
                    pageNum === 1 || 
                    pageNum === totalPages || 
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                  ) {
                    return (
                      <button 
                        key={pageNum}
                        onClick={() => paginate(pageNum)}
                        className={`hire-pagination-num ${currentPage === pageNum ? 'active' : ''}`}
                      >
                        {pageNum}
                      </button>
                    );
                  } else if (
                    (pageNum === currentPage - 2 && currentPage > 3) || 
                    (pageNum === currentPage + 2 && currentPage < totalPages - 2)
                  ) {
                    return <span key={pageNum} className="hire-pagination-ellipsis">...</span>;
                  } else {
                    return null;
                  }
                })}
              </div>
              
              <button 
                onClick={nextPage} 
                className="hire-pagination-btn"
                disabled={currentPage === totalPages}
              >
                Next <FaChevronRight />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default JobList;