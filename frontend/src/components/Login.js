// src/components/Login.js

import React, { useState } from 'react';
import LoginButton from './LoginButton'; // Import the LoginButton component

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'email') setEmail(value);
        if (name === 'password') setPassword(value);
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={(e) => e.preventDefault()}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" value={email} onChange={handleChange} required autoComplete="email" />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" value={password} onChange={handleChange} required autoComplete="current-password" />
                </div>
                <LoginButton email={email} password={password} />
                {error && <p>{error}</p>}
            </form>
        </div>
    );
};

export default Login;
