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

  const [showModal, setShowModal] = useState({ type: '', action: '', id: null });
  const [formData, setFormData] = useState({});
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Please log in as an admin');

        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [usersRes, jobsRes, contactsRes, serviceProvidersRes] = await Promise.all([
          axios.get('http://localhost:5000/api/admin/users', config),
          axios.get('http://localhost:5000/api/admin/jobs', config),
          axios.get('http://localhost:5000/api/admin/contacts', config),
          axios.get('http://localhost:5000/api/admin/service-providers', config),
        ]);

        setUsers(usersRes.data);
        setJobs(jobsRes.data);
        setContacts(contactsRes.data);
        setServiceProviders(serviceProvidersRes.data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (type, id) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      console.log(`Deleting ${type}/${id} at URL: http://localhost:5000/api/admin/${type}/${id}`);
      await axios.delete(`http://localhost:5000/api/admin/${type}/${id}`, config);

      if (type === 'users') setUsers(users.filter((user) => user._id !== id));
      if (type === 'jobs') setJobs(jobs.filter((job) => job._id !== id));
      if (type === 'contacts') setContacts(contacts.filter((contact) => contact._id !== id));
      if (type === 'service-providers') setServiceProviders(serviceProviders.filter((sp) => sp._id !== id));
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
        data.append('category', formData.category || '');
        data.append('location', formData.location || '');
        data.append('jobCount', formData.jobCount || '0');
        data.append('rating', formData.rating || '0');
        data.append('memberSince', formData.memberSince || '');
        if (profilePic) {
          data.append('profilePic', profilePic);
        }

        config.headers['Content-Type'] = 'multipart/form-data';

        let response;
        if (action === 'create') {
          response = await axios.post(`http://localhost:5000/api/admin/service-providers`, data, config);
          setServiceProviders([...serviceProviders, response.data]);
        } else if (action === 'update') {
          response = await axios.put(`http://localhost:5000/api/admin/service-providers/${id}`, data, config);
          setServiceProviders(serviceProviders.map((sp) => (sp._id === id ? response.data : sp)));
        }
      } else {
        let response;
        if (action === 'create') {
          response = await axios.post(`http://localhost:5000/api/admin/${type}`, formData, config);
          if (type === 'users') setUsers([...users, response.data]);
          if (type === 'jobs') setJobs([...jobs, response.data]);
          if (type === 'contacts') setContacts([...contacts, response.data]);
        } else if (action === 'update') {
          response = await axios.put(`http://localhost:5000/api/admin/${type}/${id}`, formData, config);
          if (type === 'users') setUsers(users.map((user) => (user._id === id ? response.data : user)));
          if (type === 'jobs') setJobs(jobs.map((job) => (job._id === id ? response.data : job)));
          if (type === 'contacts') setContacts(contacts.map((contact) => (contact._id === id ? response.data : contact)));
        }
      }

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
      </section>

      {/* Jobs Section */}
      <section>
        <h2>Jobs</h2>
        <button onClick={() => handleOpenModal('jobs', 'create')}>
          Add Job
        </button>
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
      </section>

      {/* Contacts Section */}
      <section>
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
      </section>

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
              <th>Job Count</th>
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
                <td>{sp.jobCount}</td>
                <td>{sp.rating}</td>
                <td>{sp.memberSince || 'N/A'}</td>
                <td>
                  <button onClick={() => handleOpenModal('service-providers', 'update', sp._id, {
                    name: sp.name,
                    category: sp.category,
                    location: sp.location,
                    jobCount: sp.jobCount,
                    rating: sp.rating,
                    memberSince: sp.memberSince,
                  })}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete('service-providers', sp._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Modal for Create/Update */}
      {showModal.type && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '5px', width: '400px' }}>
            <h2>{showModal.action === 'create' ? 'Add' : 'Edit'} {showModal.type.charAt(0).toUpperCase() + showModal.type.slice(1)}</h2>
            <form onSubmit={handleSubmit}>
              {showModal.type === 'users' && (
                <>
                  <div>
                    <label>Name:</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
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
                    <div>
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
                  <div>
                    <label>Is Admin:</label>
                    <input
                      type="checkbox"
                      name="isAdmin"
                      checked={formData.isAdmin || false}
                      onChange={handleCheckboxChange}
                    />
                  </div>
                </>
              )}

              {showModal.type === 'jobs' && (
                <>
                  <div>
                    <label>Title:</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title || ''}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
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
                  <div>
                    <label>Name:</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label>Email:</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
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
                  <div>
                    <label>Name:</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label>Profile Picture:</label>
                    <input
                      type="file"
                      name="profilePic"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                  <div>
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
                    </select>
                  </div>
                  <div>
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
                  <div>
                    <label>Job Count:</label>
                    <input
                      type="number"
                      name="jobCount"
                      value={formData.jobCount || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label>Rating (0-5):</label>
                    <input
                      type="number"
                      name="rating"
                      min="0"
                      max="5"
                      step="0.1"
                      value={formData.rating || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label>Member Since (e.g., Jun 2019):</label>
                    <input
                      type="text"
                      name="memberSince"
                      value={formData.memberSince || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                </>
              )}

              <button type="submit">{showModal.action === 'create' ? 'Add' : 'Update'}</button>
              <button type="button" onClick={handleCloseModal}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;