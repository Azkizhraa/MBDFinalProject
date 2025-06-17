// src/components/BookSessionPage.jsx (Updated Version)
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { supabase } from '../supabaseClient';
import './BookASession.css';

const BookSessionPage = () => {
  const { computerId } = useParams(); // This will be undefined if no ID is in the URL
  const navigate = useNavigate(); // Initialize navigate
  
  // If computerId exists, use it. Otherwise, start with null.
  const [selectedComputerId, setSelectedComputerId] = useState(computerId || null);
  
  const [allComputers, setAllComputers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ... the useEffect hook for fetching computers remains exactly the same ...
    const fetchAllComputers = async () => {
      const { data, error } = await supabase
        .from('computer')
        .select('computer_id, position, status');
      
      if (!error) setAllComputers(data);
      setLoading(false);
    };
    fetchAllComputers();
  }, []);

  const handleComputerClick = (computer) => {
    if (computer.status === 'Available') {
      setSelectedComputerId(computer.computer_id);
    }
  };

  const handleContinue = () => {
    if (selectedComputerId) {
      // Navigate to the next page, passing the selected computer ID
      navigate(`/confirm-booking/${selectedComputerId}`);
    } else {
      alert("Please select an available computer.");
    }
  };

  if (loading) return <div className="page-container"><h1 className="page-title">Loading...</h1></div>;

  return (
    <div className="page-container">
      <h1 className="page-title">Book Session</h1>
      <div className="booking-window">
        {/* This is the top "title bar" of the window */}
        <div className="window-title-bar">
          <div className="window-dots"></div>
        </div>

        {/* This container will hold our custom layout */}
        <div className="layout-container">
          {/* Top Row of Computers */}
          <div className="top-row">
            {allComputers
              .filter(pc => pc.position.endsWith('C'))
              .map(computer => (
                <div 
                  key={computer.computer_id}
                  className={`computer-box ${computer.status.toLowerCase()} ${computer.computer_id === selectedComputerId ? 'selected' : ''}`}
                  onClick={() => handleComputerClick(computer)}
                >
                  {computer.position}
                </div>
              ))}
          </div>

          {/* Main area with side columns */}
          <div className="main-area">
            {/* Left Column */}
            <div className="side-column">
              {allComputers
                .filter(pc => pc.position.endsWith('A'))
                .sort((a, b) => b.position.localeCompare(a.position)) // Sorts 5A, 4A, etc.
                .map(computer => (
                  <div 
                    key={computer.computer_id}
                    className={`computer-box ${computer.status.toLowerCase()} ${computer.computer_id === selectedComputerId ? 'selected' : ''}`}
                    onClick={() => handleComputerClick(computer)}
                  >
                    {computer.position}
                  </div>
                ))}
            </div>

            {/* Right Column */}
            <div className="side-column">
              {allComputers
                .filter(pc => pc.position.endsWith('B'))
                .sort((a, b) => b.position.localeCompare(a.position)) // Sorts 5B, 4B, etc.
                .map(computer => (
                  <div 
                    key={computer.computer_id}
                    className={`computer-box ${computer.status.toLowerCase()} ${computer.computer_id === selectedComputerId ? 'selected' : ''}`}
                    onClick={() => handleComputerClick(computer)}
                  >
                    {computer.position}
                  </div>
                ))}
            </div>
          </div>
          
          <button className="front-desk-button">Front Desk</button>
        </div>

        <button onClick={handleContinue} className="continue-button" disabled={!selectedComputerId}>Continue</button>
      </div>
      <Link to="/" className="back-button">BACK TO HOME</Link>
    </div>
  );
};

export default BookSessionPage;