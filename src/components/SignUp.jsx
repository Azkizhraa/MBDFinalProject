import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import '../style.css';

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState(''); 
    const [selectedUserType, setSelectedUserType] = useState('customer');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Prepare user metadata
            const userMetadata = {
                user_type: selectedUserType,
                full_name: name,
                phone_number: phone,
                ...(selectedUserType === 'employee' && { gender: gender })
            };

            // Create user in Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    emailRedirectTo: `${window.location.origin}/`,
                    data: userMetadata,
                },
            });

            if (authError) {
                console.error("Supabase Auth Error:", authError.message);
                throw authError;
            }

            // IMPORTANT: Direct insertion into the correct table based on user type
            // This ensures the user is properly registered in addition to the trigger
            if (authData?.user) {
                if (selectedUserType === 'employee') {
                    console.log("Manually inserting employee record");
                    const { error: empError } = await supabase
                        .from('employee')
                        .insert([{
                            employee_id: authData.user.id,
                            name: name,
                            email: email,
                            phone_number: phone,
                            gender: gender
                        }]);
                    
                    if (empError) {
                        console.error("Error creating employee record:", empError);
                    } else {
                        console.log("Employee record created successfully");
                    }
                } else {
                    // For customers - also do direct insertion as backup
                    const { error: custError } = await supabase
                        .from('customer')
                        .insert([{
                            customer_id: authData.user.id,
                            customer_name: name,
                            email: email,
                            phone_number: phone
                        }]);
                    
                    if (custError) {
                        console.error("Error creating customer record:", custError);
                    } else {
                        console.log("Customer record created successfully");
                    }
                }
            }

            if (!authData || !authData.user) {
                console.log("Auth user data not immediately available (email verification pending)");
                alert('Sign up successful! Please check your email to verify your account.');
                navigate('/login');
                return;
            }

            console.log("Supabase Auth User created:", authData.user);
            alert('Sign up successful! Please check your email to verify your account.');
            navigate('/login');

        } catch (error) {
            console.error('Sign Up Process Error:', error.message);
            setError(error.message);
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