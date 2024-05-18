// routes/Favorites.js

const express = require('express');
const { Favorite, Movie } = require('../models');  // Import Movie model
const router = express.Router();
const axios = require('axios');

const API_KEY = process.env.THEMOVIEDB_API_KEY;

// Route to search movies using TMDB API
router.get('/movies/search', async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ message: "Query parameter is required." });
  }
  const url = `https://api.themoviedb.org/3/search/movie`;
  try {
      const response = await axios.get(url, {
          params: {
              api_key: API_KEY,
              query: query,
              include_adult: false,
              language: 'en-US'
          }
      });
      console.log("TMDB Response:", response.data);
      res.json(response.data.results);
  } catch (error) {
      console.error('Search API error:', error);
      res.status(500).json({ message: "Failed to fetch movies", error: error.message });
  }
});

// Generic add favorite endpoint
router.post('/add', async (req, res) => {
  const { user_Id, item_Id, item_Type, movieId, movieTitle, posterPath } = req.body;
  console.log("Adding a new favorite:", req.body); // Debugging line

  try {
    // Check if the movie already exists in the movies table
    let movie = await Movie.findOne({ where: { id: movieId } });

    if (!movie) {
      // If the movie doesn't exist, insert it into the movies table
      movie = await Movie.create({
        id: movieId,
        title: movieTitle,
        release_date: null, // Add the release date if available
        poster_path: posterPath,
        description: null, // Add the description if available
      });
    }

    // Insert the favorite into the favorites table
    const newFavorite = await Favorite.create({
      user_Id,
      item_Id,
      item_Type,
    });

    res.status(201).json(newFavorite);
  } catch (error) {
    console.error('Failed to add favorite:', error);
    res.status(500).send('Failed to add to favorites.');
  }
});

module.exports = router;
