import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './BookingHistory.css'; // We will create this file next

const BookingHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // 1. Get the current logged-in user's data
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          throw new Error('You must be logged in to view booking history.');
        }

        // 2. Fetch transactions that match the user's ID
        // We also fetch the 'brand' from the related 'computer' table
        const { data, error } = await supabase
          .from('transaction')
          .select('*, transaction_computer(*, computer(*))')
          .eq('customer_customer_id', user.id); // This is the crucial filter

        if (error) throw error;

        setHistory(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return <div className="page-container"><h1 className="page-title">Loading History...</h1></div>;
  }

  if (error) {
    return <div className="page-container"><h1 className="page-title">{error}</h1></div>;
  }

  return (
    <div className="page-container">
      <h1 className="page-title">BOOKING HISTORY</h1>
      
      <div className="history-list-container">
        {history.length > 0 ? (
          history.map(item => (
            <div className="history-item" key={item.transaction_id}>
              <div className="history-item-header">
                Transaction ID: {item.transaction_id}
              </div>
              <div className="history-item-body">
                <p><strong>Computer:</strong> {computerInfo?.brand || 'N/A'} (Table {computerInfo?.table_location || 'N/A'})</p>
                <p><strong>Cost:</strong> ${item.hourly_cost}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="no-history-message">You have no booking history.</p>
        )}
      </div>

      <Link to="/" className="back-button">BACK TO HOME</Link>
    </div>
  );
};

export default BookingHistoryPage;