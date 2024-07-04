// frontend/src/services/tmdbClient.js

const axios = require('axios');

const bearerToken = process.env.THEMOVIEDB_API_TOKEN;
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
            _id: movie.id,  // using TMDB id as MongoDB _id
            title: movie.title,
            release_date: movie.release_date,
            poster_path: movie.poster_path,
            overview: movie.overview,
            vote_average: movie.vote_average,
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
