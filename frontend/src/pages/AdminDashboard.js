import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [serviceProviders, setServiceProviders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState({
    users: 1,
    jobs: 1,
    contacts: 1,
    'service-providers': 1
  });
  const [totalItems, setTotalItems] = useState({
    users: 0,
    jobs: 0,
    contacts: 0,
    'service-providers': 0
  });
  const itemsPerPage = 5; // Number of items to display per page

  const [showModal, setShowModal] = useState({ type: '', action: '', id: null });
  const [formData, setFormData] = useState({});
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Please log in as an admin');

        const config = { headers: { Authorization: `Bearer ${token}` } };

        // Fetch data with pagination parameters
        const [usersRes, jobsRes, contactsRes, serviceProvidersRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/admin/users?page=${currentPage.users}&limit=${itemsPerPage}`, config),
          axios.get(`http://localhost:5000/api/admin/jobs?page=${currentPage.jobs}&limit=${itemsPerPage}`, config),
          axios.get(`http://localhost:5000/api/admin/contacts?page=${currentPage.contacts}&limit=${itemsPerPage}`, config),
          axios.get(`http://localhost:5000/api/admin/service-providers?page=${currentPage['service-providers']}&limit=${itemsPerPage}`, config),
        ]);

        // Update state with paginated data
        setUsers(usersRes.data.items || usersRes.data);
        setJobs(jobsRes.data.items || jobsRes.data);
        setContacts(contactsRes.data.items || contactsRes.data);
        setServiceProviders(serviceProvidersRes.data.items || serviceProvidersRes.data);
        
        // Update total items count
        setTotalItems({
          users: usersRes.data.total || usersRes.data.length,
          jobs: jobsRes.data.total || jobsRes.data.length,
          contacts: contactsRes.data.total || contactsRes.data.length,
          'service-providers': serviceProvidersRes.data.total || serviceProvidersRes.data.length
        });
        
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]); // Re-fetch when page changes

  // Pagination controls
  const handlePageChange = (type, page) => {
    setCurrentPage({
      ...currentPage,
      [type]: page
    });
  };

  // Generate pagination buttons
  const renderPagination = (type) => {
    const totalPages = Math.ceil(totalItems[type] / itemsPerPage);
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button 
          key={i} 
          onClick={() => handlePageChange(type, i)}
          className={currentPage[type] === i ? 'active' : ''}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="pagination">
        <button 
          onClick={() => handlePageChange(type, Math.max(1, currentPage[type] - 1))}
          disabled={currentPage[type] === 1}
        >
          Previous
        </button>
        {pageNumbers}
        <button 
          onClick={() => handlePageChange(type, Math.min(totalPages, currentPage[type] + 1))}
          disabled={currentPage[type] === totalPages}
        >
          Next
        </button>
      </div>
    );
  };

  const handleDelete = async (type, id) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      console.log(`Deleting ${type}/${id} at URL: http://localhost:5000/api/admin/${type}/${id}`);
      await axios.delete(`http://localhost:5000/api/admin/${type}/${id}`, config);

      // After deletion, refresh the current page to show accurate data
      handlePageChange(type, currentPage[type]);
      
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.response?.data?.message || `Failed to delete ${type}`);
    }
  };

  const handleOpenModal = (type, action, id = null, data = {}) => {
    setShowModal({ type, action, id });
    setFormData(data);
    setProfilePic(null);
  };

  const handleCloseModal = () => {
    setShowModal({ type: '', action: '', id: null });
    setFormData({});
    setProfilePic(null);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setProfilePic(e.target.files[0]);
  };

  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { type, action, id } = showModal;
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (type === 'service-providers') {
        const data = new FormData();
        data.append('name', formData.name || '');
        data.append('email', formData.email || '');
        data.append('phoneNumber', formData.phoneNumber || '');
        data.append('category', formData.category || '');
        data.append('location', formData.location || '');
        data.append('jobCount', formData.jobCount || '0');
        data.append('completedJobs', formData.completedJobs || '0');
        data.append('rating', formData.rating || '0');
        data.append('experience', formData.experience || '');
        data.append('availability', formData.availability || '');
        data.append('description', formData.description || '');
        data.append('memberSince', formData.memberSince || '');
        data.append('isVerified', formData.isVerified || false);
        
        if (profilePic) {
          data.append('profilePic', profilePic);
        }

        if (action === 'create') {
          await axios.post('http://localhost:5000/api/admin/service-providers', data, config);
        } else {
          await axios.put(`http://localhost:5000/api/admin/service-providers/${id}`, data, config);
        }
      } else {
        if (action === 'create') {
          await axios.post(`http://localhost:5000/api/admin/${type}`, formData, config);
        } else if (action === 'update') {
          await axios.put(`http://localhost:5000/api/admin/${type}/${id}`, formData, config);
        }
      }

      // Refresh the current page after create/update
      handlePageChange(type, currentPage[type]);
      handleCloseModal();
    } catch (err) {
      setError(err.message || `Failed to ${action} ${type}`);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Users Section */}
      <section>
        <h2>Users</h2>
        <button onClick={() => handleOpenModal('users', 'create')}>
          Add User
        </button>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.isAdmin ? 'Admin' : 'User'}</td>
                <td>
                  <button onClick={() => handleOpenModal('users', 'update', user._id, {
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin,
                  })}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete('users', user._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {renderPagination('users')}
      </section>

      {/* Jobs Section */}
      <section>
        <h2>Jobs</h2>
        {/* <button onClick={() => handleOpenModal('jobs', 'create')}>
          Add Job
        </button> */}
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Posted By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job._id}>
                <td>{job.title}</td>
                <td>{job.description}</td>
                <td>{job.postedBy?.email || 'Unknown'}</td>
                <td>
                  <button onClick={() => handleOpenModal('jobs', 'update', job._id, {
                    title: job.title,
                    description: job.description,
                  })}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete('jobs', job._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {renderPagination('jobs')}
      </section>

      {/* Contacts Section */}
      {/* <section>
        <h2>Contact Messages</h2>
        <button onClick={() => handleOpenModal('contacts', 'create')}>
          Add Contact
        </button>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Message</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact._id}>
                <td>{contact.name}</td>
                <td>{contact.email}</td>
                <td>{contact.message}</td>
                <td>
                  <button onClick={() => handleOpenModal('contacts', 'update', contact._id, {
                    name: contact.name,
                    email: contact.email,
                    message: contact.message,
                  })}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete('contacts', contact._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {renderPagination('contacts')}
      </section> */}

      {/* Service Providers Section */}
      <section>
        <h2>Service Providers</h2>
        <button onClick={() => handleOpenModal('service-providers', 'create')}>
          Add Service Provider
        </button>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Profile Picture</th>
              <th>Category</th>
              <th>Location</th>
              <th>Experience</th>
              <th>Contact</th>
              <th>Jobs</th>
              <th>Rating</th>
              <th>Member Since</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {serviceProviders.map((sp) => (
              <tr key={sp._id}>
                <td>{sp.name}</td>
                <td>
                  {sp.profilePic ? (
                    <img
                      src={`http://localhost:5000/${sp.profilePic}`}
                      alt={sp.name}
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      onError={(e) => (e.target.src = 'https://via.placeholder.com/50')}
                    />
                  ) : (
                    'No Image'
                  )}
                </td>
                <td>{sp.category}</td>
                <td>{sp.location}</td>
                <td>{sp.experience || 'Not specified'}</td>
                <td>{sp.phoneNumber || 'Not provided'}</td>
                <td>
                  {sp.jobCount || 0} ({sp.completedJobs || 0} completed)
                </td>
                <td>{sp.rating || 0}/5</td>
                <td>{sp.memberSince || 'N/A'}</td>
                <td>
                  <button onClick={() => handleOpenModal('service-providers', 'update', sp._id, {
                    name: sp.name,
                    email: sp.email,
                    phoneNumber: sp.phoneNumber,
                    category: sp.category,
                    location: sp.location,
                    jobCount: sp.jobCount,
                    completedJobs: sp.completedJobs,
                    rating: sp.rating,
                    experience: sp.experience,
                    availability: sp.availability,
                    description: sp.description,
                    memberSince: sp.memberSince,
                    isVerified: sp.isVerified,
                  })}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete('service-providers', sp._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {renderPagination('service-providers')}
      </section>

      {/* Modal for Create/Update */}
      {showModal.type && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h2>{showModal.action === 'create' ? 'Add' : 'Edit'} {showModal.type.charAt(0).toUpperCase() + showModal.type.slice(1)}</h2>
              <button 
                type="button" 
                className="admin-modal-close" 
                onClick={handleCloseModal}
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="admin-form">
              {showModal.type === 'users' && (
                <>
                  <div className="admin-form-group">
                    <label>Name:</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Email:</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  {showModal.action === 'create' && (
                    <div className="admin-form-group">
                      <label>Password:</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password || ''}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  )}
                  <div className="admin-form-group">
                    <label className="admin-checkbox-label">
                      <input
                        type="checkbox"
                        name="isAdmin"
                        checked={formData.isAdmin || false}
                        onChange={handleCheckboxChange}
                      />
                      Is Admin
                    </label>
                  </div>
                </>
              )}

              {showModal.type === 'jobs' && (
                <>
                  <div className="admin-form-group">
                    <label>Title:</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title || ''}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Description:</label>
                    <textarea
                      name="description"
                      value={formData.description || ''}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </>
              )}

              {showModal.type === 'contacts' && (
                <>
                  <div className="admin-form-group">
                    <label>Name:</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Email:</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Message:</label>
                    <textarea
                      name="message"
                      value={formData.message || ''}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </>
              )}

              {showModal.type === 'service-providers' && (
                <>
                  <div className="admin-form-group">
                    <label>Name:</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="admin-form-group">
                    <label>Email:</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="admin-form-group">
                    <label>Phone Number:</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="admin-form-group">
                    <label>Profile Picture:</label>
                    <input
                      type="file"
                      name="profilePic"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                  
                  <div className="admin-form-row">
                    <div className="admin-form-group">
                      <label>Category:</label>
                      <select
                        name="category"
                        value={formData.category || ''}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="" disabled>Select a category</option>
                        <option value="Technicians">Technicians</option>
                        <option value="AC Repairs">AC Repairs</option>
                        <option value="CCTV">CCTV</option>
                        <option value="Electricians">Electricians</option>
                        <option value="Plumbing">Plumbing</option>
                        <option value="Iron Works">Iron Works</option>
                        <option value="Wood Works">Wood Works</option>
                        <option value="Constructions">Constructions</option>
                        <option value="Electronic Repairs">Electronic Repairs</option>
                        <option value="Glass & Aluminium">Glass & Aluminium</option>
                        <option value="Masonry">Masonry</option>
                        <option value="Odd Jobs">Odd Jobs</option>
                        <option value="Vehicles">Vehicles</option>
                      </select>
                    </div>
                    
                    <div className="admin-form-group">
                      <label>Location:</label>
                      <select
                        name="location"
                        value={formData.location || ''}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="" disabled>Select a location</option>
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
                  </div>
                  
                  <div className="admin-form-row">
                    <div className="admin-form-group">
                      <label>Experience Level:</label>
                      <select
                        name="experience"
                        value={formData.experience || ''}
                        onChange={handleInputChange}
                      >
                        <option value="">Select experience level</option>
                        <option value="Entry">Entry Level</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Expert">Expert</option>
                      </select>
                    </div>
                    
                    <div className="admin-form-group">
                      <label>Availability:</label>
                      <select
                        name="availability"
                        value={formData.availability || ''}
                        onChange={handleInputChange}
                      >
                        <option value="">Select availability</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Weekends">Weekends only</option>
                        <option value="Flexible">Flexible hours</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="admin-form-group">
                    <label>Description:</label>
                    <textarea
                      name="description"
                      value={formData.description || ''}
                      onChange={handleInputChange}
                      placeholder="Service provider description"
                    />
                  </div>
                  
                  <div className="admin-form-row">
                    <div className="admin-form-group">
                      <label>Job Count:</label>
                      <input
                        type="number"
                        name="jobCount"
                        min="0"
                        value={formData.jobCount || '0'}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="admin-form-group">
                      <label>Completed Jobs:</label>
                      <input
                        type="number"
                        name="completedJobs"
                        min="0"
                        value={formData.completedJobs || '0'}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="admin-form-group">
                      <label>Rating (0-5):</label>
                      <input
                        type="number"
                        name="rating"
                        min="0"
                        max="5"
                        step="0.1"
                        value={formData.rating || '0'}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="admin-form-row">
                    <div className="admin-form-group">
                      <label>Member Since:</label>
                      <input
                        type="text"
                        name="memberSince"
                        value={formData.memberSince || ''}
                        onChange={handleInputChange}
                        placeholder="e.g., Jun 2019"
                      />
                    </div>
                    
                    <div className="admin-form-group">
                      <label className="admin-checkbox-label">
                        <input
                          type="checkbox"
                          name="isVerified"
                          checked={formData.isVerified || false}
                          onChange={handleCheckboxChange}
                        />
                        Is Verified
                      </label>
                    </div>
                  </div>
                </>
              )}

              <div className="admin-form-buttons">
                <button type="button" onClick={handleCloseModal}>Cancel</button>
                <button type="submit">{showModal.action === 'create' ? 'Add' : 'Update'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;