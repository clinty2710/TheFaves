// frontend/src/services/spotifyClient.js

import axios from 'axios';

const API_KEY = process.env.RAPIDAPI_KEY; // Replace with your actual API key
const BASE_URL = 'https://spotify23.p.rapidapi.com';

const spotifyClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-RapidAPI-Key': API_KEY,
    'X-RapidAPI-Host': 'spotify23.p.rapidapi.com',
  },
});

export const searchMusic = async (query) => {
  try {
    const response = await spotifyClient.get('/search/', {
      params: {
        q: query,
        type: 'multi',
        offset: '0',
        limit: '10',
        numberOfTopResults: '5',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching music:', error);
    throw error;
  }
};

export default spotifyClient;
