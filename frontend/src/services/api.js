// src/services/api.js

import axios from 'axios';
import API_BASE_URL from '../config';

// Helper function to ensure no double slashes in URLs
const constructURL = (path) => `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(constructURL('/auth/register'), userData, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await axios.post(constructURL('/auth/login'), userData, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

export const getUserProfile = async () => {
  try {
    const response = await axios.get(constructURL('/auth/profile'), { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    throw error;
  }
};
