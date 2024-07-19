// src/components/Login.js

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginUser } from '../services/api';
import { useAuth } from '../AuthContext';
import { useUser } from './UserContext';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../styles.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setAuthenticated } = useAuth();
  const { setUser } = useUser();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log('Attempting login with:', { email, password });
      const response = await loginUser({ email, password });
      console.log('Login response:', response);
      if (response.success) {
        setAuthenticated(true);
        setUser(response.user);
        sessionStorage.setItem('isAuthenticated', true);
        toast.success('Login successful');
        navigate('/profile');
      } else {
        setAuthenticated(false);
        sessionStorage.removeItem('isAuthenticated');
        toast.error('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login.');
    }
  };

  return (
    <div className="login-container">
      <header className="App-header">
        <div className="logo">
          <span className="my">my</span>
          <span className="f">F</span>
          <span className="a">A</span>
          <span className="heart-v"></span>
          <span className="e">E</span>
          <span className="s">S</span>
        </div>
      </header>
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
      <p className="center-links">Don't have an account? <Link to="/register">Register here</Link></p>
    </div>
  );
};

export default Login;
