// src/services/api.js

import axios from 'axios';
import API_BASE_URL from '../config';

// Helper function to ensure no double slashes in URLs
const constructURL = (path) => `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;

axios.defaults.withCredentials = true; // Ensure credentials (cookies) are sent with every request

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

// Function to get user profile
export const getUserProfile = async () => {
  try {
    const response = await axios.get(constructURL('/auth/profile'), { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    throw error;
  }
};
