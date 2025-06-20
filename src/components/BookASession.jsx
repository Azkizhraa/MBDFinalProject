// src/components/BookASession.jsx (Final Corrected Version)
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './BookASession.css';

const BookASession = () => {
  const { computerId } = useParams();
  const navigate = useNavigate();
  
  const [selectedComputerId, setSelectedComputerId] = useState(computerId || null);
  const [allComputers, setAllComputers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(''); // State untuk menyimpan pesan error

  useEffect(() => {
    const fetchAllComputers = async () => {
      try {
        // 👇 FIXED: Query sekarang menggabungkan computer_schedule untuk mendapatkan status
        const { data, error } = await supabase
          .from('computer')
          .select('computer_id, table_location, computer_schedule(status)');
        
        if (error) throw error; // Lemparkan error jika ada

        setAllComputers(data);

      } catch (err) {
        setError(err.message); // Tangkap dan simpan pesan error
        console.error("Error fetching computer data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllComputers();
  }, []);

  const handleComputerClick = (computer, status) => {
    // Hanya izinkan klik jika statusnya 'available'
    if (status === 'available') {
      setSelectedComputerId(computer.computer_id);
    }
  };

  const handleContinue = () => {
    if (selectedComputerId) {
      navigate(`/confirm-booking/${selectedComputerId}`);
    } else {
      alert("Please select an available computer.");
    }
  };

  if (loading) return <div className="page-container"><h1 className="page-title">Loading...</h1></div>;
  if (error) return <div className="page-container"><h1 className="page-title">Error: {error}</h1></div>;

  return (
    <div className="page-container">
      <h1 className="page-title">Book A Session</h1>
      <div className="booking-window">
        <div className="window-title-bar">
          <div className="window-dots"></div>
        </div>

        <div className="layout-container">
          <div className="top-row">
            {allComputers
              .filter(pc => pc.table_location && pc.table_location.endsWith('C'))
              .map(computer => {
                // 👇 FIXED: Ambil status dari data yang sudah di-join
                const status = computer.computer_schedule?.[0]?.status || 'unknown';
                return (
                  <div 
                    key={computer.computer_id}
                    className={`computer-box ${status} ${computer.computer_id === selectedComputerId ? 'selected' : ''}`}
                    onClick={() => handleComputerClick(computer, status)}
                  >
                    {computer.table_location}
                  </div>
                )
              })}
          </div>

          <div className="main-area">
            <div className="side-column">
              {allComputers
                .filter(pc => pc.table_location && pc.table_location.endsWith('A'))
                .sort((a, b) => parseInt(b.table_location) - parseInt(a.table_location))
                .map(computer => {
                  const status = computer.computer_schedule?.[0]?.status || 'unknown';
                  return (
                    <div 
                      key={computer.computer_id}
                      className={`computer-box ${status} ${computer.computer_id === selectedComputerId ? 'selected' : ''}`}
                      onClick={() => handleComputerClick(computer, status)}
                    >
                      {computer.table_location}
                    </div>
                  )
                })}
            </div>

            <div className="side-column">
               {allComputers
                .filter(pc => pc.table_location && pc.table_location.endsWith('B'))
                .sort((a, b) => parseInt(b.table_location) - parseInt(a.table_location))
                .map(computer => {
                  const status = computer.computer_schedule?.[0]?.status || 'unknown';
                  return (
                    <div 
                      key={computer.computer_id}
                      className={`computer-box ${status} ${computer.computer_id === selectedComputerId ? 'selected' : ''}`}
                      onClick={() => handleComputerClick(computer, status)}
                    >
                      {computer.table_location}
                    </div>
                  )
                })}
            </div>
          </div>
          
          <div className="front-desk-button">Front Desk</div>
        </div>

        <button onClick={handleContinue} className="continue-button" disabled={!selectedComputerId}>Continue</button>
      </div>
      <Link to="/" className="back-button">BACK TO HOME</Link>
    </div>
  );
};

export default BookASession;