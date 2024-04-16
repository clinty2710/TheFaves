// LogoutButton.js

import React from 'react';
import axios from 'axios'; // Import axios for making HTTP requests

const LogoutButton = () => {
  const handleLogout = async () => {
    try {
      await axios.get('/auth/logout');
      // Redirect the user to the login page after successful logout
      window.location.href = '/auth/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
