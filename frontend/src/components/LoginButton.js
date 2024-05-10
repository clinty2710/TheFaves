// LoginButton.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginButton = ({ email, password }) => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('/auth/login', { email, password }, {
          headers: {
            'Content-Type': 'application/json'
          }
      });
      if (response.data && response.data.success) {
        navigate('/profile'); // Redirect to profile on success
      } else {
        // handle errors here if login was unsuccessful
        console.error('Login error:', response.data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <button onClick={handleLogin}>Log In</button>
  );
};

export default LoginButton;