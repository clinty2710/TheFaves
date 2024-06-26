// src/services/api.js

import axios from 'axios';
import API_BASE_URL from '../config';

// Helper function to ensure no double slashes in URLs
const constructURL = (path) => `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;

// Example function to register a user
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(constructURL('/auth/register'), userData);
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
};

// Example function to log in a user
export const loginUser = async (userData) => {
  try {
    const response = await axios.post(constructURL('/auth/login'), userData);
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};
