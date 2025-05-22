import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/PostJob.css';
import jobImage from '../Images/different-occupations-young-women 1.png';
import Footer from '../components/Footer';
import axios from 'axios';

const PostJob = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Check if user is logged in on page load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    if (!token || !user) {
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for token before submitting
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    if (!token || !user) {
      setError('Please log in to post a job');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('salary', budget ? parseFloat(budget) : undefined);
      formData.append('postedBy', user._id);
      if (image) formData.append('image', image);

      console.log('Authorization Header:', `Bearer ${token}`);
      await axios.post('http://localhost:5000/api/jobs', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('Job posted successfully!');
      setError(null);

      // Reset form
      setTitle('');
      setDescription('');
      setBudget('');
      setCategory('');
      setImage(null);

      // Redirect to Work page after 2 seconds
      setTimeout(() => {
        navigate('/work');
      }, 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to post job';
      setError(errorMessage);
      setSuccess(null);

      // Redirect to login if 401 error (no token or invalid token)
      if (err.response?.status === 401) {
        localStorage.clear(); // Clear invalid token
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      }
    }
  };

  const handleCancel = () => {
    navigate('/work');
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <div>
      <div className="post-job-container">
        <div className="post-job-form">
          <h1 className="form-title">Post a Job</h1>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Job Title*</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Plumber required to fix a pressure pump"
                required
              />
            </div>

            <div className="form-group">
              <label>Description*</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Professional plumber required to fix a pressure pump for a bathroom"
                required
              />
            </div>

            <div className="form-group">
              <label>Budget (Rs.)</label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="e.g., 8000"
              />
            </div>

            <div className="form-group">
              <label>Category*</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select a category</option>
                <option value="Technicians">Technicians</option>
                <option value="AC Repairs">AC Repairs</option>
                <option value="CCTV">CCTV</option>
                <option value="Constructions">Constructions</option>
                <option value="Electricians">Electricians</option>
                <option value="Electronic Repairs">Electronic Repairs</option>
                <option value="Glass & Aluminium">Glass & Aluminium</option>
                <option value="Iron Works">Iron Works</option>
                <option value="Masonry">Masonry</option>
                <option value="Odd Jobs">Odd Jobs</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Wood Works">Wood Works</option>
                <option value="Vehicles">Vehicles</option>
              </select>
            </div>

            <div className="form-group">
              <label>Upload Image (optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            <div className="form-buttons">
              <button type="button" className="cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
              <button type="submit" className="submit-btn">
                Submit
              </button>
            </div>
          </form>

          {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
          {success && <p style={{ color: 'green', marginTop: '10px' }}>{success}</p>}
        </div>

        <div className="post-job-image">
          <img src={jobImage} alt="Different occupations young women" className="job-image" />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PostJob;