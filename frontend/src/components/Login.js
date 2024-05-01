// src/components/Login.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Added for navigation after login

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');  // Added for error handling
    const navigate = useNavigate();  // Hook for redirecting

    const handleLogin = async (e) => {
        e.preventDefault();  // Prevent default form submission behavior
        try {
            const response = await axios.post('/auth/login', { email, password });
            if (response.data) {
                navigate('/profile-page');  // Redirect to profile on success
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Failed to log in. Please check your credentials.');  // Update error state
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit">Log In</button>
                {error && <p>{error}</p>}  // Display error message if there is an error
            </form>
        </div>
    );
};

export default Login;
