// frontend/src/services/tmdbClient.js

import axios from 'axios';

const API_KEY = process.env.THEMOVIEDB_API_KEY;
const baseURL = 'https://api.themoviedb.org/3';

const tmdbClient = axios.create({
  baseURL: baseURL,
  params: {
    api_key: API_KEY
  }
});

export const searchMovies = async (query) => {
  try {
    const response = await tmdbClient.get('/search/movie', {
      params: { query }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error searching movies:', error);
    return [];
  }
};

export const getMovieDetails = async (movieId) => {
  try {
    const response = await tmdbClient.get(`/movie/${movieId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
};

export default { searchMovies, getMovieDetails };