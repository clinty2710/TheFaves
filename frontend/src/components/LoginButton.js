// LoginButton.js

import React from 'react';
import { useHistory } from 'react-router-dom'; // Import useHistory hook for redirection
import axios from 'axios'; // Import axios for making HTTP requests

const LoginButton = () => {
  const history = useHistory();

  const handleLogin = async () => {
    try {
      // Make a POST request to your backend server to handle authentication
      const response = await axios.post('/auth/login');
      console.log(response.data); // Log the response from the server
      // Optionally, you can redirect the user to another page upon successful login
      // history.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <button onClick={handleLogin}>Log In</button>
  );
};

export default LoginButton;
