import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import loginImage from '../Images/female-male-workers-wearing-work-clothes 1.png';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Attempting login with:', { email, password }); // Debug log
      const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      console.log('Login response:', loginResponse.data); // Debug log
      const { token } = loginResponse.data;

      // Store token in localStorage
      localStorage.setItem('token', token);

      // Fetch user admin status
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const meResponse = await axios.get('http://localhost:5000/api/auth/me', config);
      console.log('Admin status response:', meResponse.data); // Debug log
      const isAdmin = meResponse.data.isAdmin;

      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify({ isAdmin }));

      setSuccess('Login successful!');
      setError(null);

      // Redirect based on admin status after 2 seconds
      setTimeout(() => {
        if (isAdmin) {
          navigate('/admin');
        } else {
          navigate('/work');
        }
      }, 2000);
    } catch (err) {
      console.error('Login error:', err.response || err); // Debug log
      setError(err.response?.data?.message || 'Failed to login');
      setSuccess(null);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <img src={loginImage} alt="Workers" className="login-image" />
      </div>
      <div className="login-right">
        <div className="login-form">
          <h1>Log in to WorkMart</h1>
          <p>Enter your details below</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="login-button">
              Log in
            </button>

            <a href="/forgot-password" className="forgot-password">
              Forget Password?
            </a>
          </form>

          {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
          {success && <p style={{ color: 'green', marginTop: '10px' }}>{success}</p>}
        </div>
      </div>
    </div>
  );
};

export default Login;