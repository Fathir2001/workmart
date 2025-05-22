import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import axios from 'axios';

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Category from './components/Category';
import Comments from './components/Comments';
import Introduction from './components/Introduction';
import ServiceProviders from './components/ServiceProviders';
import Footer from './components/Footer';
import Introduction2 from './components/Introduction2';
import Contact from './components/Contact';
import SideBar from './components/SideBar';
import ViewWorkers from './components/ViewWorkers';
import Bottom from './components/Bottom';
import Payment from './components/Payment';
import PostJob from './pages/PostJob';
import ProfileView from './components/ProfileView';
import Contacts from './pages/Contacts';
import About from './pages/About';
import FAQ from './pages/FAQ';
import NavBar2 from './components/Navbar2'; // Fixed typo: Navbar2 → NavBar2
import Hire from './pages/Hire';
import Work from './pages/Work';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';


function App() {
  const [isAdmin, setIsAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state to prevent premature redirects

  useEffect(() => {
    const fetchUserAdminStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const config = { headers: { Authorization: `Bearer ${token}` } };
          const response = await axios.get('http://localhost:5000/api/auth/me', config);
          setIsAdmin(response.data.isAdmin);
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        console.error('Failed to fetch admin status:', err);
        localStorage.removeItem('token');
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserAdminStatus();
    
    // Listen for auth changes
    const handleAuthChange = () => {
      fetchUserAdminStatus();
    };
    
    window.addEventListener('authChange', handleAuthChange);
    return () => window.removeEventListener('authChange', handleAuthChange);
  }, []);

    const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) return <Navigate to="/login" />;
    if (isLoading) return <div>Loading...</div>; // Show loading while fetching admin status
    if (isAdmin !== true) return <Navigate to="/work" />; // Redirect non-admins to /work
    return children;
  };

  return (
    <Router>
      <div>
        <NavBar2 />
      </div>
     
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/" element={<Home />} />
        
        <Route path="/category" element={<Category />} />
        <Route path="/comments" element={<Comments />} />
        <Route path="/introduction" element={<Introduction />} />
        <Route path="/serviceproviders" element={<ServiceProviders />} />
        <Route path="/footer" element={<Footer />} />
        <Route path="/introduction2" element={<Introduction2 />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/sidebar" element={<SideBar />} />
        <Route path="/viewworkers" element={<ViewWorkers />} />
        <Route path="/bottom" element={<Bottom />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/postjob" element={<PostJob />} />
        <Route path="/profileview" element={<ProfileView />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/hire" element={<Hire />} />
        <Route path="/work" element={<Work />} />
        <Route path="/profile" element={<Profile />} />
        
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;