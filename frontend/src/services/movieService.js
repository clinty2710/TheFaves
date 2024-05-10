//TheFaves/frontend/src/services/movieService.js

const axios = require('axios');
const API_KEY = process.env.THEMOVIEDB_API_KEY; // Ensure you have this variable in your environment

const fetchMoviesByTitle = async (title) => {
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(title)}`);
    return response.data.results;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};

module.exports = { fetchMoviesByTitle };
