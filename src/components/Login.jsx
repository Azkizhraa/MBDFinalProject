// src/components/Login.jsx (Refactored Version)
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate
import '../style.css';

const Login = ({ userType = 'customer' }) => { // Default to 'customer'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) throw error;
      // On success, App.jsx's auth listener will handle navigation
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const title = userType === 'admin' ? 'Admin Login' : 'Login';
  const signUpPath = userType === 'admin' ? '/admin/signup' : '/signup';

  return (
    <div className="login-container">
      <div className="login-header">
        <span className="login-title">{title}</span>
        <button className="close-button">X</button>
      </div>
      <form className="login-form" onSubmit={handleLogin}>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pixel-input"
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pixel-input"
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <div className="login-actions">
          <p className="no-account">
            Don't have an account?{' '}
            <Link to={signUpPath} className="link-button">Sign Up</Link>
          </p>
          <button type="submit" className="login-button pixel-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
        
        {/* The new button to switch between user types */}
        <div className="user-type-switch">
          {userType === 'customer' ? (
            <Link to="/admin/login" className="link-button">I'm the admin</Link>
          ) : (
            <Link to="/login" className="link-button">I'm a customer</Link>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;