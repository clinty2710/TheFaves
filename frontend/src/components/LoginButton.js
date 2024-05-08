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
      console.log(response.data);
      if (response.data && response.data.success) {
        console.log("Authentication success, navigating to profile.");
        navigate('/profile'); // Make sure this navigation is correct
      } else {
        console.error('Login error:', response.data.message); // Log server-provided error message if any
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
