// LoginButton.js
// Clint Steadman

import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './../AuthContext';

const LoginButton = ({ email, password }) => {
  const navigate = useNavigate();
  const { setAuthenticated } = useAuth();

  const handleLogin = async () => {
    try {
      const response = await axios.post('/auth/login', { email, password }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
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
    <button onClick={handleLogin}>Login</button>
  );
};

export default LoginButton;
