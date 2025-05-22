import React, { useState } from 'react';
   import { FcGoogle } from 'react-icons/fc';
   import axios from 'axios';
   import '../styles/Register.css';
   import workerImage from '../Images/female-male-workers-wearing-work-clothes 1.png';

   const Register = () => {
     const [name, setName] = useState('');
     const [emailOrPhone, setEmailOrPhone] = useState('');
     const [password, setPassword] = useState('');
     const [error, setError] = useState(null);
     const [success, setSuccess] = useState(null);

     const handleSubmit = async (e) => {
       e.preventDefault();
       try {
         const response = await axios.post('http://localhost:5000/api/users/register', {
           name,
           emailOrPhone,
           password,
         });
         setSuccess('Account created successfully!');
         setError(null);
         setTimeout(() => {
           window.location.href = '/login';
         }, 2000);
       } catch (err) {
         setError(err.response?.data?.message || 'Failed to create account');
         setSuccess(null);
       }
     };

     return (
       <div className="register-page">
         <div className="register-left">
           <img 
             src={workerImage} 
             alt="Workers" 
             className="register-image"
           />
         </div>
         
         <div className="register-right">
           <div className="register-form">
             <h2 className="register-title">Create an account</h2>
             <p className="register-subtitle">Enter your details below</p>

             <form className="form-fields" onSubmit={handleSubmit}>
               <div className="form-group">
                 <label htmlFor="name">Name</label>
                 <input 
                   type="text" 
                   id="name" 
                   className="form-input" 
                   placeholder="Enter your name" 
                   value={name}
                   onChange={(e) => setName(e.target.value)}
                   required
                 />
               </div>

               <div className="form-group">
                 <label htmlFor="email">Email or Phone Number</label>
                 <input 
                   type="text" 
                   id="email" 
                   className="form-input" 
                   placeholder="Enter your email or phone" 
                   value={emailOrPhone}
                   onChange={(e) => setEmailOrPhone(e.target.value)}
                   required
                 />
               </div>

               <div className="form-group">
                 <label htmlFor="password">Password</label>
                 <input 
                   type="password" 
                   id="password" 
                   className="form-input" 
                   placeholder="Enter your password" 
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   required
                 />
               </div>

               <button type="submit" className="register-button">
                 Create Account
               </button>
             </form>

             {error && <p style={{ color: 'red' }}>{error}</p>}
             {success && <p style={{ color: 'green' }}>{success}</p>}

             <div className="social-login">
               <button className="google-button">
                 <FcGoogle className="google-icon" />
                 <span>Sign up with Google</span>
               </button>
             </div>

             <div className="login-redirect">
               Already have account? <a href="/login" className="login-link">Log in</a>
             </div>
           </div>
         </div>
       </div>
     );
   };

   export default Register;