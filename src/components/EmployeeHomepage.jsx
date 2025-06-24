import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './EmployeeHomepage.css';

// Import your pixel art icons
import userProfileIcon from '../assets/user-profile-icon.png';
import shiftIcon from '../assets/session-icon.png'; // Reusing session icon for shifts
import transactionIcon from '../assets/booking-history-icon.png'; // Reusing booking history icon for transactions
import homeIcon from '../assets/home-icon.png';

const EmployeeHomepage = ({ session }) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);
  
  const handleViewShiftsClick = () => navigate('/employee/shifts');
  const handleViewTransactionsClick = () => navigate('/employee/transactions');
  const handleHomeClick = () => navigate('/');

  return (
    <div className="employee-homepage-container">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Top Bar */}
      <div className="employee-homepage-top-bar">
        <h1 className="employee-homepage-title">Admin Dashboard</h1>
        <div className="user-profile-widget" onClick={() => setSidebarOpen(true)}>
          <img src={userProfileIcon} alt="User Profile" className="user-profile-icon" />
        </div>
      </div>

      {/* Main Content Grid - Now with just 2 buttons */}
      <div className="employee-homepage-grid">
        <div className="grid-item" onClick={handleViewShiftsClick}>
          <img src={shiftIcon} alt="View Shifts" className="grid-icon" />
          <span className="grid-text">Shift Details</span>
        </div>
        <div className="grid-item" onClick={handleViewTransactionsClick}>
          <img src={transactionIcon} alt="View Transactions" className="grid-icon" />
          <span className="grid-text">Transactions</span>
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

export default EmployeeHomepage;