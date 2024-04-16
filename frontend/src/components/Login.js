// src/components/Login.js

import React, { useState } from 'react';
import axios from 'axios'; // Import axios for making HTTP requests

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            // Make a POST request to your backend server to handle authentication
            const response = await axios.post('/auth/login', { email, password });
            console.log(response.data); // Log the response from the server
            // Optionally, you can redirect the user to another page upon successful login
            // window.location.href = '/dashboard';
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <div>
                <label>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
                <label>Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button onClick={handleLogin}>Log In</button>
        </div>
    );
};

export default Login;
