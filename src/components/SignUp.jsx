// src/components/SignUp.jsx (Refactored Version)
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import '../style.css';

const SignUp = ({ userType = 'customer' }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  // Assuming 'gender' is a field you want to collect
  const [gender, setGender] = useState(''); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // 1. Create the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (authError) throw authError;

      // 2. Insert the user's profile info into your public 'customer' table
      const { error: profileError } = await supabase
        .from('customer')
        .insert({
          customer_id: authData.user.id, // Link to the auth user
          customer_name: name,
          email: email,
          phone_number: phone,
          // 'gender' is an example, add any other fields you need
          role: userType, // This is the crucial part: sets 'customer' or 'admin'
        });

      if (profileError) throw profileError;
      
      alert('Sign up successful! Please check your email to verify your account.');

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const title = userType === 'admin' ? 'Admin Sign Up' : 'Sign Up';
  const loginPath = userType === 'admin' ? '/admin/login' : '/login';

  return (
    <div className="login-container">
        <div className="login-header">
            <span className="login-title">{title}</span>
        </div>
        <form className="login-form" onSubmit={handleSignUp}>
            {/* Add input fields for name, phone, gender etc. here */}
            <div className="input-group">
                <label>Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required className="pixel-input" />
            </div>
            <div className="input-group">
                <label>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="pixel-input" />
            </div>
            <div className="input-group">
                <label>Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="pixel-input" />
            </div>
            <div className="input-group">
                <label>Phone Number</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required className="pixel-input" />
            </div>
            
            {error && <p className="error-message">{error}</p>}

            <div className="login-actions">
                <p className="no-account">
                    Already have an account?{' '}
                    <Link to={loginPath} className="link-button">Login</Link>
                </p>
                <button type="submit" className="login-button pixel-button" disabled={loading}>
                    {loading ? 'Signing Up...' : 'Sign Up'}
                </button>
            </div>
        </form>
    </div>
  );
};

export default SignUp;