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
      };

      fetchProfile();
    }
  }, [isOpen]); // Re-run this effect when 'isOpen' changes

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onClose(); // Close the sidebar
    navigate('/login'); // Navigate to login page after logout
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