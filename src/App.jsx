// App.jsx (Versi Final dengan Pengecekan Role - Fixed Logout)
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/Login';
import SignUp from './components/SignUp';
import HomePage from './components/HomePage';
import EmployeeHomepage from './components/EmployeeHomepage';
import SessionDetail from './components/SessionDetail';
import ViewComputer from './components/ViewComputer';
import BookingHistory from './components/BookingHistory';
import BookASession from './components/BookASession';
import BookingConfirmation from './components/BookingConfirmation';
import ComputerSchedule from './components/ComputerSchedule';
import UpdateProfile from './components/UpdateProfile';
import Settings from './components/Settings';
import ShiftDetail from './components/ShiftDetail';
import TransactionHistory from './components/TransactionHistory';

import { supabase } from './supabaseClient';
import './App.css';

export async function logoutUser() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    // Force hard reload to clear all React state
    window.location.href = '/login';
    return { success: true };
  } catch (error) {
    console.error('Error logging out:', error.message);
    return { success: false, error };
  }
}

function App() {
  const [session, setSession] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to check user role
  const checkUserRole = async (currentSession) => {
    console.log("Checking user role for session:", currentSession);

    if (currentSession) {
      try {
        const userId = currentSession.user.id; // Use UUID
        console.log("Looking for employee with ID:", userId);

        // Debug: Log all employees
        const { data: allEmployees } = await supabase
          .from('employee')
          .select('*');
        console.log("All employees in DB:", allEmployees);

        // Query for this user by UUID
        const { data: employeeData, error } = await supabase
          .from('employee')
          .select('employee_id')
          .eq('employee_id', userId)
          .maybeSingle();

        console.log("Query sent: ", userId);
        console.log("Employee query result:", employeeData, error);

        if (error) {
          console.error("Error checking user role:", error);
          setUserRole('employeer');
          return;
        }

        if (employeeData) {
          console.log("User is an employee");
          setUserRole('employee');
        } else {
          console.log("User is a customer");
          setUserRole('customer');
        }
      } catch (error) {
        console.error("Error checking user role:", error);
        setUserRole('employee');
      }
    } else {
      console.log("No session - setting role to null");
      setUserRole(null);
    }
  };

  useEffect(() => {
    // Add a timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      console.log("Loading timeout reached - forcing loading to false");
      setLoading(false);
      if (!session) {
        setUserRole(null); // Set to null if no session
      }
    }, 5000); // 5 second timeout

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log("Initial session check:", session);
      setSession(session);

      try {
        await checkUserRole(session);
      } catch (error) {
        console.error("Error in checkUserRole:", error);
        setUserRole(null); // Set to null on error
      }

      clearTimeout(loadingTimeout); // Clear timeout if successful
      setLoading(false);
    }).catch((error) => {
      console.error("Error getting session:", error);
      clearTimeout(loadingTimeout);
      setLoading(false);
      setUserRole(null); // Set to null on error
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("Auth state changed:", _event, session);
      setSession(session);

      try {
        await checkUserRole(session);
      } catch (error) {
        console.error("Error in auth state change checkUserRole:", error);
        setUserRole(null); // Set to null on error
      }
    });

    return () => {
      clearTimeout(loadingTimeout);
      subscription.unsubscribe();
    };
  }, []);

  // Add debug logging to see what's happening
  useEffect(() => {
    console.log("Session:", session);
    console.log("User Role:", userRole);
    console.log("Loading:", loading);
  }, [session, userRole, loading]);

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
              {/* Route kondisional berdasarkan role */}
              <Route 
                path="/" 
                element={userRole === 'employee' ? <EmployeeHomepage /> : <HomePage />} 
              />
              <Route path="/session" element={<SessionDetail />} />
              <Route path="/view-computers" element={<ViewComputer />} />
              <Route path="/history" element={<BookingHistory />} />
              <Route path="/book/:computerId?" element={<BookASession />} />
              <Route path="/confirm-booking/:computerId" element={<BookingConfirmation />} />
              <Route path="/schedule/:computerId" element={<ComputerSchedule />} />
              <Route path="/update-profile" element={<UpdateProfile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/employee/shifts" element={<ShiftDetail />} />
              <Route path="/employee/transactions" element={<TransactionHistory />} />

              {/* Redirects */}
              <Route path="/login" element={<Navigate to="/" />} />
              <Route path="/admin/login" element={<Navigate to="/" />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          ) : (
            // RUTE UNTUK USER YANG BELUM LOGIN
            <>
              <Route path="/login" element={<div className="auth-page-wrapper"><h1 className="main-title">WarneTC</h1><Login userType="customer" /></div>} />
              <Route path="/admin/login" element={<div className="auth-page-wrapper"><h1 className="main-title">WarneTC</h1><Login userType="employee" /></div>} />
              
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