// src/components/SignUp.jsx (Final Corrected Version - Integrated with Database Trigger)
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import '../style.css'; // Keep your relative import path

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState(''); // Only applicable for Employee
    const [selectedUserType, setSelectedUserType] = useState('customer'); // State for user type selection
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // 1. Prepare user metadata to be sent with Supabase Auth signup.
            // This data will be available in the 'raw_user_meta_data' column
            // of the 'auth.users' table and will be read by our database trigger.
            const userMetadata = {
                user_type: selectedUserType,
                full_name: name, // Using 'full_name' for consistency with database trigger
                phone_number: phone,
                // Only include gender if the user is signing up as an employee
                ...(selectedUserType === 'employee' && { gender: gender })
            };

            // 2. Create the user in Supabase Auth, passing the metadata.
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    emailRedirectTo: `${window.location.origin}/`, // Optional: Redirect after email verification
                    data: userMetadata, // Pass the prepared metadata here
                },
            });

            if (authError) {
                console.error("Supabase Auth Error:", authError.message);
                throw authError; // Re-throw to be caught by outer try-catch
            }

            // Important: If email confirmation is enabled in Supabase, authData.user will be null
            // immediately after signUp until the user clicks the verification link in their email.
            // The database trigger will still fire and create the profile because auth.users record is created.
            if (!authData || !authData.user) {
                console.log("Auth user data not immediately available after signup (likely email verification pending).");
                alert('Sign up successful! Please check your email to verify your account.');
                navigate('/login'); // Redirect to login, where they can sign in after verification
                return; // Exit here, as profile creation is handled by the trigger.
            }

            // If authData.user is immediately available (e.g., email confirmation is off,
            // or using magic link where user is signed in immediately upon successful signup),
            // you might want a different toast or flow.
            // For this setup, we rely on the DB trigger for profile creation.
            console.log("Supabase Auth User created:", authData.user);
            alert('Sign up successful! Please check your email to verify your account.');
            navigate('/login'); // Redirect to login page for post-verification sign-in

        } catch (error) {
            console.error('Sign Up Process Error:', error.message);
            setError(error.message);
            // This is where general errors (e.g., network, server issues,
            // or issues with the initial auth.signUp itself) will be caught.
            // Display 'error.message' to the user.
        } finally {
            setLoading(false);
        }
    };

    const loginPath = '/login';

    return (
        <div className="login-container">
            <div className="login-header">
                <span className="login-title">Sign Up</span>
            </div>
            <form className="login-form" onSubmit={handleSignUp}>
                <div className="input-group">
                    <label>Sign Up As:</label>
                    <select value={selectedUserType} onChange={e => setSelectedUserType(e.target.value)} className="pixel-input">
                        <option value="customer">Customer</option>
                        <option value="employee">Employee</option>
                    </select>
                </div>

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

                {selectedUserType === 'employee' && (
                    <div className="input-group">
                        <label>Gender</label>
                        <input type="text" value={gender} onChange={e => setGender(e.target.value)} required className="pixel-input" />
                    </div>
                )}

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