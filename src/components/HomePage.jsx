import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar'; // Make sure Sidebar is imported
import './HomePage.css';

// Import your pixel art icons
import userProfileIcon from '../assets/user-profile-icon.png';
import viewComputersIcon from '../assets/view-computers-icon.png';
import sessionIcon from '../assets/session-icon.png';
import bookingHistoryIcon from '../assets/booking-history-icon.png';
import homeIcon from '../assets/home-icon.png';

const HomePage = ({ session }) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false); // Check #2
  const handleViewComputersClick = () => navigate('/view-computers');
  const handleBookASessionClick = () => navigate('/book');
  const handleBookingHistoryClick = () => navigate('/history');
  const handleHomeClick = () => navigate('/');

  return (
    <div className="homepage-container">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} /> {/* Check #3 */}

      {/* Top Bar */}
      <div className="homepage-top-bar">
        <h1 className="homepage-title">WarneTC</h1>
        {/* Check #1 */}
        <div className="user-profile-widget" onClick={() => setSidebarOpen(true)}>
          <img src={userProfileIcon} alt="User Profile" className="user-profile-icon" />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="homepage-grid">
        <div className="grid-item" onClick={handleViewComputersClick}>
          <img src={viewComputersIcon} alt="View Computers" className="grid-icon" />
          <span className="grid-text">View Computers</span>
        </div>
        <div className="grid-item" onClick={handleBookASessionClick}>
          <img src={sessionIcon} alt="Book A Session" className="grid-icon" />
          <span className="grid-text">Book A Session</span>
        </div>
        <div className="grid-item" onClick={handleBookingHistoryClick}>
          <img src={bookingHistoryIcon} alt="Booking History" className="grid-icon" />
          <span className="grid-text">Booking History</span>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="homepage-bottom-bar">
        <div className="bottom-nav-item home-button" onClick={handleHomeClick}>
          <img src={homeIcon} alt="Home" className="home-icon" />
        </div>
      </div>
    </div>
  );
};

export default HomePage;