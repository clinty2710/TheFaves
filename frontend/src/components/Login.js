// src/components/Login.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './../AuthContext';
import LoginButton from './LoginButton';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { setAuthenticated } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/auth/login', { email, password }, {
                headers: { 'Content-Type': 'application/json' }
            });
            if (response.data.success) {
                setAuthenticated(true);
                sessionStorage.setItem('isAuthenticated', true); // Persist authentication state
                navigate('/profile');
            } else {
                setAuthenticated(false);
                sessionStorage.removeItem('isAuthenticated');
                alert('Login failed. Please check your credentials.');
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
