// src/components/LogoutButton.js

import React from 'react';
import { useNavigate } from 'react-router-dom'; // Ensure this import is present
import axios from 'axios';

const LogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await axios.post('/auth/logout');
            console.log('Logout successful:', response.data);
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
};

export default LogoutButton;
