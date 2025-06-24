import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './TransactionHistory.css'; // Kita akan buat file ini selanjutnya

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // Mengambil data dari tabel booking_log sebagai data transaksi
        // Anda bisa mengganti 'booking_log' jika punya tabel transaksi khusus
        const { data, error } = await supabase
          .from('booking_log')
          .select(`
            booking_id,
            total_price,
            start_time,
            profiles (username),
            computer_details (computer_name)
          `)
          .order('start_time', { ascending: false }); // Mengurutkan dari yang terbaru

        if (error) throw error;
        
        setTransactions(data);
      } catch (err) {
        setError('Tidak bisa mengambil riwayat transaksi.');
        console.error("Error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return <div className="page-container"><h1 className="page-title">Loading Transactions...</h1></div>;
  }

  if (error) {
    return <div className="page-container"><h1 className="page-title">{error}</h1></div>;
  }

  return (
    <div className="page-container">
      <h1 className="page-title">TRANSACTION HISTORY</h1>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Username</th>
              <th>Computer</th>
              <th>Date</th>
              <th>Total Price</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((trx) => (
              <tr key={trx.booking_id}>
                <td>{trx.booking_id}</td>
                <td>{trx.profiles ? trx.profiles.username : 'N/A'}</td>
                <td>{trx.computer_details ? trx.computer_details.computer_name : 'N/A'}</td>
                <td>{new Date(trx.start_time).toLocaleString('id-ID')}</td>
                <td>Rp{trx.total_price.toLocaleString('id-ID')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Link to="/" className="back-button">BACK TO DASHBOARD</Link>
    </div>
  );
};

export default TransactionHistory;
