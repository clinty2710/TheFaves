// LoginButton.js

import React from 'react';
import { useNavigate } from 'react-router-dom'; // Changed to useNavigate hook for React Router v6
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
      console.log(response.data);
      if (response.data && response.data.success) {
        navigate('/profile-page');  // Redirect to profile on success
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
