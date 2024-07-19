// src/services/api.js

import axios from 'axios';

axios.defaults.withCredentials = true;

// Remove the base URL setting, rely on relative paths and Netlify's proxying
// axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;

// Helper function to ensure no double slashes in URLs
const constructURL = (path) => `${path.startsWith('/') ? '' : '/'}${path}`;

// Example function to register a user
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(constructURL('/auth/register'), userData, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
};

// Example function to log in a user
export const loginUser = async (userData) => {
  try {
    const response = await axios.post(constructURL('/auth/login'), userData, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

// Function to fetch the user profile
export const getUserProfile = async () => {
  try {
    const response = await axios.get(constructURL('/auth/profile'), {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    throw error;
  }
};
