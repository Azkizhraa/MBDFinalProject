// App.jsx (Versi Final dengan Pengecekan Role)
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import semua komponen Anda, termasuk EmployeeHomepage
import Login from './components/Login';
import SignUp from './components/SignUp';
import HomePage from './components/HomePage';
import EmployeeHomepage from './components/EmployeeHomepage'; // <-- DITAMBAHKAN
import SessionDetail from './components/SessionDetail';
import ViewComputer from './components/ViewComputer';
import BookingHistory from './components/BookingHistory';
import BookASession from './components/BookASession';
import BookingConfirmation from './components/BookingConfirmation';
import ComputerSchedule from './components/ComputerSchedule';
import UpdateProfile from './components/UpdateProfile';
import Settings from './components/Settings';

import { supabase } from './supabaseClient';
import './App.css';

function App() {
  const [session, setSession] = useState(null);
  const [userRole, setUserRole] = useState(null); // <-- DITAMBAHKAN: State untuk menyimpan role
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // --- LOGIKA BARU UNTUK MENGECEK ROLE SETELAH LOGIN ---
    const checkUserRole = async (currentSession) => {
      if (currentSession) {
        try {
          const { data: employeeData } = await supabase
            .from('Employee')
            .select('Employee_ID')
            .eq('Employee_ID', currentSession.user.id)
            .maybeSingle();

          if (employeeData) {
            setUserRole('admin');
          } else {
            setUserRole('customer');
          }
        } catch (error) {
          console.error("Error checking user role:", error);
          setUserRole('customer'); // Default ke customer jika ada error
        }
      } else {
        setUserRole(null); // Reset role jika logout
      }
      setLoading(false);
    };
    
    // Pengecekan sesi awal saat halaman pertama kali dimuat
    supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        checkUserRole(session); // Langsung cek role setelah dapat sesi awal
    });

    // Listener untuk mendeteksi perubahan login/logout di masa depan
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      // Tidak perlu cek role lagi di sini karena getSession di atas sudah menangani
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="loading-screen">Loading Session...</div>;
  }

  return (
    <BrowserRouter>
      <div className="app-background">
        <Routes>
          {session ? (
            // RUTE UNTUK USER YANG SUDAH LOGIN
            <>
              {/* 👇 INI BAGIAN PENTINGNYA: Route kondisional berdasarkan role */}
              <Route 
                path="/" 
                element={userRole === 'admin' ? <EmployeeHomepage /> : <HomePage />} 
              />
              <Route path="/session" element={<SessionDetail />} />
              <Route path="/view-computers" element={<ViewComputer />} />
              <Route path="/history" element={<BookingHistory />} />
              <Route path="/book/:computerId?" element={<BookASession />} />
              <Route path="/confirm-booking/:computerId" element={<BookingConfirmation />} />
              <Route path="/schedule/:computerId" element={<ComputerSchedule />} />
              <Route path="/update-profile" element={<UpdateProfile />} />
              <Route path="/settings" element={<Settings />} />

              {/* Redirects */}
              <Route path="/login" element={<Navigate to="/" />} />
              <Route path="/admin/login" element={<Navigate to="/" />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          ) : (
            // RUTE UNTUK USER YANG BELUM LOGIN
            // ...MENJADI SEPERTI INI
            <>
              <Route path="/login" element={<div className="auth-page-wrapper"><h1 className="main-title">WarneTC</h1><Login userType="customer" /></div>} />
              <Route path="/admin/login" element={<div className="auth-page-wrapper"><h1 className="main-title">WarneTC</h1><Login userType="admin" /></div>} />
              
              {/* Hanya butuh satu route untuk SignUp */}
              <Route path="/signup" element={<div className="auth-page-wrapper"><h1 className="main-title">WarneTC</h1><SignUp /></div>} />

              {/* Redirect URL aneh ke halaman login utama */}
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          )}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;