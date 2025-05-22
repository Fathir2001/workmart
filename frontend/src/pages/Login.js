import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import loginImage from '../Images/female-male-workers-wearing-work-clothes 1.png';
import axios from 'axios';

const Login = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Attempting login with:', { emailOrPhone, password });
      const loginResponse = await axios.post('http://localhost:5000/api/users/login', {
        emailOrPhone,
        password,
      });

      // Store token and user data in localStorage
      localStorage.setItem('token', loginResponse.data.token);
      localStorage.setItem('user', JSON.stringify(loginResponse.data.user));

      // Dispatch a custom event to notify navbar of authentication change
      window.dispatchEvent(new Event('authChange'));

      setSuccess('Login successful!');
      setError(null);

      // Navigate based on user role
      setTimeout(() => {
        if (loginResponse.data.user.isAdmin) {
          // Use window.location for a full page reload to ensure App.js re-fetches admin status
          window.location.href = '/admin';
        } else {
          navigate('/');
        }
      }, 1500);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Failed to login');
      setSuccess(null);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <img 
          src={loginImage} 
          alt="Login" 
          className="login-image"
        />
      </div>
      
      <div className="login-right">
        <div className="login-form">
          <h1>Log in to WorkMart</h1>
          <p>Enter your details below</p>
          
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email or Phone Number</label>
              <input 
                type="text"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="Enter your email or phone"
                required
              />
            </div>
            
            <div className="input-group">
              <label>Password</label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              {/* <a href="/forgot-password" className="forgot-link">Forgot password?</a> */}
            </div>
            
            <button type="submit" className="login-button">Log In</button>
          </form>
          
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          
          <div className="register-section">
            <p>Don't have an account? <a href="/register">Create an account</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;