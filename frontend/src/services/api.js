// src/services/api.js

import axios from 'axios';

axios.defaults.withCredentials = true;

export const getUserProfile = async () => {
  try {
    const response = await axios.get('/auth/profile', {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    throw error;
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await axios.post('/auth/login', userData, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await axios.post('/auth/register', userData, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
};
