// src/components/ShiftDetail.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './ShiftDetail.css'; // We will create this CSS file next

const ShiftDetail = () => {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        // Fetches all records from the shift_detail table
        const { data, error } = await supabase
          .from('shift_detail')
          .select('shift_id, day, shift_start, shift_end');

        if (error) throw error;

        // Sort data by day of the week for consistency
        const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        const sortedData = data.sort((a, b) => daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day));

        setShifts(sortedData);
      } catch (err) {
        setError('Could not fetch shift details. Please try again.');
        console.error("Error fetching shift data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchShifts();
  }, []);

  if (loading) {
    return <div className="page-container"><h1 className="page-title">Loading Shifts...</h1></div>;
  }

  if (error) {
    return <div className="page-container"><h1 className="page-title">{error}</h1></div>;
  }

  return (
    <div className="page-container">
      <h1 className="page-title">SHIFT DETAILS</h1>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Shift ID</th>
              <th>Day</th>
              <th>Shift Start</th>
              <th>Shift End</th>
            </tr>
          </thead>
          <tbody>
            {shifts.map((shift) => (
              <tr key={shift.shift_id}>
                <td>{shift.shift_id}</td>
                <td>{shift.day}</td>
                {/* Displaying only HH:MM from the time value */}
                <td>{shift.shift_start ? shift.shift_start.slice(0, 5) : 'N/A'}</td>
                <td>{shift.shift_end ? shift.shift_end.slice(0, 5) : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* This button navigates the user back to the main employee dashboard */}
      <Link to="/" className="back-button">BACK TO DASHBOARD</Link>
    </div>
  );
};

export default ShiftDetail;