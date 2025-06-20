// src/components/EmployeeHomepage.jsx (Versi Perbaikan)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './EmployeeHomepage.css'; // FIXED: Menggunakan CSS sendiri

// Import your pixel art icons
import userProfileIcon from '../assets/user-profile-icon.png';
import viewComputersIcon from '../assets/view-computers-icon.png';
import sessionIcon from '../assets/session-icon.png';
import bookingHistoryIcon from '../assets/booking-history-icon.png';
import homeIcon from '../assets/home-icon.png';

// 👇 FIXED: Nama komponen diubah menjadi EmployeeHomepage
const EmployeeHomepage = ({ session }) => { 
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const handleViewComputersClick = () => navigate('/view-computers');
  const handleBookASessionClick = () => navigate('/book');
  const handleBookingHistoryClick = () => navigate('/history');
  // Tombol home di halaman admin bisa juga mengarah ke root admin
  const handleHomeClick = () => navigate('/'); 

  return (
    // 👇 FIXED: Semua className diubah
    <div className="employee-homepage-container">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Top Bar */}
      <div className="employee-homepage-top-bar">
        <h1 className="employee-homepage-title">Admin Dashboard</h1>
        <div className="user-profile-widget" onClick={() => setSidebarOpen(true)}>
          <img src={userProfileIcon} alt="User Profile" className="user-profile-icon" />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="employee-homepage-grid">
        <div className="grid-item" onClick={handleViewComputersClick}>
          <img src={viewComputersIcon} alt="View All Shifts" className="grid-icon" />
          <span className="grid-text">View Computers</span>
        </div>
        <div className="grid-item" onClick={handleBookASessionClick}>
          <img src={sessionIcon} alt="View All Transactions" className="grid-icon" />
          <span className="grid-text">Book A Session</span>
        </div>
        <div className="grid-item" onClick={handleBookingHistoryClick}>
          <img src={bookingHistoryIcon} alt="View All Transactions" className="grid-icon" />
          <span className="grid-text">Booking History</span>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="employee-homepage-bottom-bar">
        <div className="bottom-nav-item home-button" onClick={handleHomeClick}>
          <img src={homeIcon} alt="Home" className="home-icon" />
        </div>
      </div>
    </div>
  );
};

// 👇 FIXED: Nama export diubah menjadi EmployeeHomepage
export default EmployeeHomepage;