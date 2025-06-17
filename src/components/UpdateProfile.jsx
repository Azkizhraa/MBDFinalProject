import React from 'react';
import { Link } from 'react-router-dom';
// You can reuse the CSS from another page for now
import './BookingHistory.css'; 

const UpdateProfilePage = () => {
  return (
    <div className="page-container">
      <h1 className="page-title">UPDATE PROFILE</h1>
      <p style={{color: '#fff', textAlign: 'center'}}>This page is under construction.</p>
      <Link to="/" className="back-button">BACK TO HOME</Link>
    </div>
  );
};

export default UpdateProfilePage;