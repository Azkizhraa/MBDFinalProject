// src/components/Settings.jsx

import React from 'react';
import { Link } from 'react-router-dom';

// We can reuse the CSS from another page for consistent styling.
// You can create a dedicated SettingsPage.css later if you want.
import './BookingHistory.css'; 

const SettingsPage = () => {
  return (
    <div className="page-container">
      <h1 className="page-title">SETTINGS</h1>
      
      <div style={{
        backgroundColor: 'rgba(60, 14, 78, 0.8)', 
        border: '4px solid #8a2be2',
        boxShadow: '6px 6px 0px #1e0528',
        padding: '40px', 
        textAlign: 'center',
        color: '#fff',
        maxWidth: '600px'
      }}>
        <p>This page is under construction.</p>
        <p>Future settings will be available here!</p>
      </div>

      <Link to="/" className="back-button">BACK TO HOME</Link>
    </div>
  );
};

export default SettingsPage;