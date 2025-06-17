// App.jsx (Final Corrected Version)
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import local components with consistent names
import Login from './components/Login';
import SignUp from './components/SignUp';
import HomePage from './components/HomePage';
import SessionDetail from './components/SessionDetail'; // FIXED: Added missing import
import ViewComputer from './components/ViewComputer';
import BookingHistory from './components/BookingHistory';
import BookASession from './components/BookASession';
import ComputerSchedule from './components/ComputerSchedule';
import UpdateProfile from './components/UpdateProfile';
import Settings from './components/Settings';

// Import Supabase client and CSS
import { supabase } from './supabaseClient';
import './App.css';

function App() {
  // FIXED: Removed unused isLoginView state
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading session...</div>;
  }

  return (
    <BrowserRouter>
      <div className="app-background">
        <Routes>
          {/* LOGGED-OUT-ONLY ROUTES */}
          {!session ? (
            <>
              {/* Login/Signup pages have their own wrapper to show the main title */}
              <Route path="/login" element={<div className="auth-page-wrapper"><h1 className="main-title">WarneTC</h1><Login userType="customer" /></div>} />
              <Route path="/signup" element={<div className="auth-page-wrapper"><h1 className="main-title">WarneTC</h1><SignUp userType="customer" /></div>} />
              <Route path="/admin/login" element={<div className="auth-page-wrapper"><h1 className="main-title">WarneTC</h1><Login userType="admin" /></div>} />
              <Route path="/admin/signup" element={<div className="auth-page-wrapper"><h1 className="main-title">WarneTC</h1><SignUp userType="admin" /></div>} />
              {/* For any other path, redirect to login when logged out */}
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          ) : (
            <>
              {/* LOGGED-IN-ONLY ROUTES */}
              <Route path="/" element={<HomePage />} />
              <Route path="/session" element={<SessionDetail />} />
              <Route path="/view-computers" element={<ViewComputer />} />
              <Route path="/history" element={<BookingHistory />} />
              {/* Optional param for book page */}
              <Route path="/book/:computerId?" element={<BookASession />} />
              <Route path="/schedule/:computerId" element={<ComputerSchedule />} />
              <Route path="/update-profile" element={<UpdateProfile />} />
              <Route path="/settings" element={<Settings />} />
              {/* If a logged-in user tries a login URL, redirect to home */}
              <Route path="/login" element={<Navigate to="/" />} />
              <Route path="/signup" element={<Navigate to="/" />} />
              <Route path="/admin/login" element={<Navigate to="/" />} />
              <Route path="/admin/signup" element={<Navigate to="/" />} />
              {/* For any other path, redirect to home when logged in */}
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;