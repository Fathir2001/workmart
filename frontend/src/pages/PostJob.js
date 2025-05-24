import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/PostJob.css';
import jobImage from '../Images/different-occupations-young-women 1.png';
import Footer from '../components/Footer';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaStar } from 'react-icons/fa';

const PostJob = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null);
  const [experience, setExperience] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [availability, setAvailability] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Check if user is logged in on page load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    if (!token || !user) {
      // Show Sweet Alert for non-authenticated users
      Swal.fire({
        title: 'Authentication Required',
        text: 'Please login to post a job',
        icon: 'warning',
        confirmButtonText: 'Login Now',
        showCancelButton: true,
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          // Store intended destination
          localStorage.setItem('redirectAfterLogin', '/postjob');
          navigate('/login');
        } else {
          navigate('/work'); // Redirect to work page if they cancel
        }
      });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for token before submitting
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    if (!token || !user) {
      Swal.fire({
        title: 'Authentication Required',
        text: 'Please login to post a job',
        icon: 'warning',
        confirmButtonText: 'Login Now',
        showCancelButton: true,
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.setItem('redirectAfterLogin', '/postjob');
          navigate('/login');
        }
      });
      return;
    }

    // Check if required fields are filled
    if (!title || !description || !category || !location) {
      Swal.fire({
        title: 'Missing Information',
        text: 'Please fill in all required fields (Title, Description, Category, and Location)',
        icon: 'warning',
      });
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('location', location); // Make sure location is added
      formData.append('salary', budget ? parseFloat(budget) : undefined);
      formData.append('experience', experience);
      formData.append('contactNumber', contactNumber);
      formData.append('availability', availability);
      formData.append('postedBy', user._id);
      if (image) formData.append('image', image);

      // Log the form data before submission (for debugging)
      console.log("Submitting job with location:", location);
      
      await axios.post('http://localhost:5000/api/jobs', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      // Show success message with Sweet Alert
      Swal.fire({
        title: 'Success!',
        text: 'Job posted successfully!',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });

      // Reset form
      setTitle('');
      setDescription('');
      setBudget('');
      setCategory('');
      setLocation('');
      setExperience('');
      setContactNumber('');
      setAvailability('');
      setImage(null);
      setImagePreview(null);

      // Redirect to Work page after 2 seconds
      setTimeout(() => {
        navigate('/work');
      }, 2000);
    } catch (err) {
      console.error("Job submission error:", err.response?.data || err.message);
      const errorMessage = err.response?.data?.message || 'Failed to post job';
      
      // Show error message with Sweet Alert
      Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
      });

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
    const selectedImage = e.target.files[0];
    setImage(selectedImage);

    // Create preview URL for the selected image
    if (selectedImage) {
      const previewUrl = URL.createObjectURL(selectedImage);
      setImagePreview(previewUrl);
    } else {
      setImagePreview(null);
    }
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
                placeholder="e.g., Experienced plumber available to fix pressure pumps."
                required
              />
            </div>

            <div className="form-group">
              <label>Description*</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Experienced plumber offering bathroom pressure pump repair services"
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
              <label>Location*</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              >
                <option value="">Select a location</option>
                <option value="Colombo">Colombo</option>
                <option value="Gampaha">Gampaha</option>
                <option value="Kalutara">Kalutara</option>
                <option value="Kandy">Kandy</option>
                <option value="Matale">Matale</option>
                <option value="Nuwara Eliya">Nuwara Eliya</option>
                <option value="Galle">Galle</option>
                <option value="Matara">Matara</option>
                <option value="Hambantota">Hambantota</option>
                <option value="Jaffna">Jaffna</option>
                <option value="Kilinochchi">Kilinochchi</option>
                <option value="Mannar">Mannar</option>
                <option value="Mullaitivu">Mullaitivu</option>
                <option value="Vavuniya">Vavuniya</option>
                <option value="Batticaloa">Batticaloa</option>
                <option value="Ampara">Ampara</option>
                <option value="Trincomalee">Trincomalee</option>
                <option value="Kurunegala">Kurunegala</option>
                <option value="Puttalam">Puttalam</option>
                <option value="Anuradhapura">Anuradhapura</option>
                <option value="Polonnaruwa">Polonnaruwa</option>
                <option value="Badulla">Badulla</option>
                <option value="Monaragala">Monaragala</option>
                <option value="Ratnapura">Ratnapura</option>
                <option value="Kegalle">Kegalle</option>
              </select>
            </div>

            <div className="form-group">
              <label>Experience Level</label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              >
                <option value="">Select experience level</option>
                <option value="Entry">Entry Level</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Expert">Expert</option>
              </select>
            </div>

            <div className="form-group">
              <label>Contact Number</label>
              <input
                type="tel"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="e.g., 0771234567"
              />
            </div>

            <div className="form-group">
              <label>Availability</label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
              >
                <option value="">Select availability</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Weekends">Weekends only</option>
                <option value="Flexible">Flexible hours</option>
              </select>
            </div>

            <div className="form-group">
              <label>Upload Image (optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div className="image-preview">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '10px' }}
                  />
                </div>
              )}
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