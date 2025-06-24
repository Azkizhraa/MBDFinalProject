import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Sidebar.css'; // We will create this next

const Sidebar = ({ isOpen, onClose }) => {
  const [profile, setProfile] = useState({ customer_name: 'Loading...', role: 'user' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Only fetch data when the sidebar is open
    if (isOpen) {
      const fetchProfile = async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error('No user logged in');

          // Fetch from the 'customer' table where the id matches
          const { data, error } = await supabase
            .from('customer')
            .select('customer_name, role')
            .eq('customer_id', user.id)
            .single(); // .single() gets one record or null

          if (error) throw error;
          if (data) setProfile(data);

        } catch (err) {
          setError(err.message);
          setProfile({ customer_name: 'Error', role: 'user' });
        }
      };      fetchProfile();
    }
  }, [isOpen]); // Re-run this effect when 'isOpen' changes

  const handleLogout = async () => {
    try {
      // Clear any local state first
      setProfile({ customer_name: 'Loading...', role: 'user' });
      setError('');
      
      // Set a timeout to force logout if it takes too long
      const timeoutId = setTimeout(() => {
        console.warn('Logout timeout - forcing logout');
        forceLogout();
      }, 5000); // 5 second timeout
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      // Clear the timeout if logout was successful
      clearTimeout(timeoutId);
      
      if (error) {
        console.error('Logout error:', error);
        // Still proceed with logout even if there's an error
        forceLogout();
        return;
      }
      
      // Success - clean up and navigate
      localStorage.clear();
      sessionStorage.clear();
      onClose();
      navigate('/login', { replace: true });
      
    } catch (err) {
      console.error('Unexpected logout error:', err);
      // Force logout even if there's an error
      forceLogout();
    }
  };

  const forceLogout = () => {
    // Clear all data regardless of errors
    localStorage.clear();
    sessionStorage.clear();
    
    // Reset state
    setProfile({ customer_name: 'Loading...', role: 'user' });
    setError('');
    
    // Close sidebar and navigate
    onClose();
    navigate('/login', { replace: true });
    
    // Force a page reload as a last resort to clear any lingering state
    setTimeout(() => {
      window.location.href = '/login';
    }, 100);
  };

  // If it's not open, render nothing.
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay that closes the sidebar when clicked */}
      <div className="sidebar-overlay" onClick={onClose}></div>
      
      <div className="sidebar-container">
        <button onClick={onClose} className="sidebar-close-button">X</button>
        
        <div className="profile-section">
          <div className="profile-name">{profile.customer_name}</div>
          <div className="profile-role">{profile.role}</div>
        </div>

        <nav className="sidebar-nav">
          <Link to="/update-profile" onClick={onClose} className="nav-button">Update Profile</Link>
          <Link to="/settings" onClick={onClose} className="nav-button">Settings</Link>
          <button onClick={handleLogout} className="nav-button logout-button">Logout</button>
        </nav>
        {error && <p className="sidebar-error">{error}</p>}
      </div>
    </>
  );
};

export default Sidebar;