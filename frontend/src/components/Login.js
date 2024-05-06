// src/components/Login.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoginButton from './LoginButton'; // Import the LoginButton component

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleCredentials = async (email, password) => {
        try {
            const response = await axios.post('/auth/login', { email, password }, {
                headers: { 'Content-Type': 'application/json' }
            });
            if (response.data.success) {
                navigate('/profile');
            } else {
                setError(response.data.message || 'Login failed. Please check your credentials.');
            }
        } catch (error) {
            setError('Login failed. Please check your credentials.');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={(e) => e.preventDefault()}>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <LoginButton email={email} password={password} handleLogin={handleCredentials} />
                {error && <p>{error}</p>}
            </form>
        </div>
    );
};

export default Login;
