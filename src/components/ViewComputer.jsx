// src/components/ViewComputerPage.jsx (Final Corrected Version based on Schema)
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './ViewComputer.css';

const ViewComputerPage = () => {
  const [computers, setComputers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComputers = async () => {
      try {
        // 👇 THIS IS THE CORRECTED QUERY 👇
        // It selects all computers and explicitly joins specs and computer_schedule
        const { data, error } = await supabase
          .from('computer')
          .select(`
            computer_id,
            table_location,
            specs (*),
            computer_schedule ( status )
          `);

        if (error) throw error; // Throw the error to be caught by the catch block

        setComputers(data);

      } catch (err) {
        setError('Could not fetch the computers. Check console for details.');
        console.error("Error fetching data:", err); // Log the actual error
      } finally {
        setLoading(false);
      }
    };

    fetchComputers();
  }, []);

  if (loading) {
    return <div className="page-container"><h1 className="page-title">Loading Computers...</h1></div>;
  }

  if (error) {
    return <div className="page-container"><h1 className="page-title">{error}</h1></div>;
  }

  return (
    <div className="page-container">
      <h1 className="page-title">VIEW COMPUTERS</h1>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th className="col-table">Table</th>
              <th className="col-brand">Brand</th>
              <th className="col-cpu">CPU</th>
              <th className="col-graphics">Graphics</th>
              <th className="col-ram">RAM</th>
              <th className="col-storage">Storage</th>
              <th className="col-status">Current Status</th>
              <th className="col-schedule">View Computer Schedule</th>
            </tr>
          </thead>
          <tbody>
            {computers.map((computer) => {
              // The status is now in an array: computer.computer_schedule
              // We take the status from the first entry in that array.
              const currentStatus = computer.computer_schedule?.[0]?.status || 'Unknown';

              return (
                <tr key={computer.computer_id}>
                  <td>{computer.table_location || 'N/A'}</td>
                  <td>{computer.specs?.brand || 'N/A'}</td>
                  <td>{computer.specs?.cpu || 'N/A'}</td>
                  <td>{computer.specs?.graphics_card || 'N/A'}</td>
                  <td>{computer.specs?.ram || 'N/A'}</td>
                  <td>{computer.specs?.storage || 'N/A'}</td>
                  <td>
                   <span className={`status-${currentStatus.toLowerCase().replace(' ', '-')}`}>
                    {currentStatus}
                   </span>
                 </td>
                <td>
                  <Link to={`/schedule/${computer.computer_id}`} className="book-button">
                    Schedule
                 </Link>
               </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Link to="/" className="back-button">BACK TO HOME</Link>
    </div>
  );
};

export default ViewComputerPage;