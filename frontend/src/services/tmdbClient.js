// frontend/src/services/tmdbClient.js

const axios = require('axios');

const bearerToken = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZDdjODdlMmM0YzdkOGNlMjVhMWJlYzMxMDAzMTNlNSIsInN1YiI6IjY2M2NmNDUwMWEzZDAyYTE0MDc4YjM4NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.uXAn0dT_6ZNH_xJrQNSrbby-5UOXP6d2SVpk5HStAM0';
const baseURL = 'https://api.themoviedb.org/3';

const tmdbClient = axios.create({
    baseURL: baseURL,
    headers: {
      'Authorization': bearerToken,
      'Accept': 'application/json'
    }
});

const searchMovies = async (query, page = 1) => {
    try {
        const response = await tmdbClient.get('/search/movie', {
            params: {
                query,  // the search keyword
                page,
                include_adult: false,
                language: 'en-US'
            }
        });
        return response.data.results.map(movie => ({
            label: `${movie.title} (${movie.release_date ? movie.release_date.split('-')[0] : 'Unknown'})`,
            value: movie.id,
            poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        }));
    } catch (error) {
        console.error('Error searching movies:', error);
        return [];
    }
};

module.exports = { searchMovies }; // Using CommonJS syntax to export
