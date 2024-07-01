// src/components/LogoutButton.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { toast } from 'react-toastify';

const LogoutButton = () => {
  const navigate = useNavigate();
  const { setAuthenticated } = useAuth();

  const handleLogout = async () => {
    try {
      await axios.post('/auth/logout');
      setAuthenticated(false);
      localStorage.removeItem('isAuthenticated');
      toast.success('Logout successful');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('An error occurred during logout.');
    }
  };

  return (
    <button onClick={handleLogout} style={{ margin: '20px auto', display: 'block' }}>Logout</button>
  );
};

export default LogoutButton;
