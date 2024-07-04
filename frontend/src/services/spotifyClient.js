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
    // Process the response to match your application's expected format
    return response.data.tracks.items.map(track => ({
      label: `${track.name} by ${track.artists.map(artist => artist.name).join(', ')}`,
      value: track.id,
      poster: track.album.images[0].url,
    }));
  } catch (error) {
    console.error('Error searching music:', error);
    return [];
  }
};

export default spotifyClient;
