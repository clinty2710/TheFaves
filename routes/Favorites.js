// routes/Favorites.js

const express = require('express');
const { Favorite, Movie } = require('../models');
const router = express.Router();
const axios = require('axios');

const API_TOKEN = process.env.THEMOVIEDB_API_TOKEN;

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
              query: query,
              include_adult: false,
              language: 'en-US'
          },
          headers: {
              'Authorization': API_TOKEN,
              'Accept': 'application/json'
          }
      });
      console.log("TMDB Response:", response.data);
      res.json(response.data.results);
  } catch (error) {
      console.error('Search API error:', error);
      res.status(500).json({ message: "Failed to fetch movies", error: error.message });
  }
});

router.post('/add', async (req, res) => {
  const { user_Id, item_Id, item_Type, movieId, movieTitle, posterPath } = req.body;
  console.log("Adding a new favorite:", req.body);

  try {
    // Fetch movie details from TMDB to get release_date
    const movieDetailsResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
      params: { language: 'en-US' },
      headers: {
        'Authorization': API_TOKEN,
        'Accept': 'application/json'
      }
    });
    const movieDetails = movieDetailsResponse.data;

    // Check if the movie already exists in the movies table
    let movie = await Movie.findOne({ where: { id: movieId } });
    if (!movie) {
      // If the movie doesn't exist, insert it into the movies table
      movie = await Movie.create({
        id: movieId,
        title: movieTitle,
        release_date: movieDetails.release_date || null,
        poster_path: posterPath,
      });
    }

    // Insert the favorite into the favorites table
    const newFavorite = await Favorite.create({
      user_Id,
      item_Id: movieId,
      item_Type: item_Type,
    });

    res.status(201).json(newFavorite);
  } catch (error) {
    console.error('Failed to add favorite:', error);
    res.status(500).send('Failed to add to favorites.');
  }
});

// Endpoint to fetch a user's favorites
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  
  try {
    const favorites = await Favorite.findAll({
      where: { user_Id: userId },
      include: [{
        model: Movie,
        as: 'movie',  // This should match the alias used in the association
      }]
    });
    
    res.json(favorites);
  } catch (error) {
    console.error('Failed to fetch favorites:', error);
    res.status(500).send('Failed to fetch favorites.');
  }
});

// Endpoint to delete a favorite
router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const favorite = await Favorite.findByPk(id);
    if (!favorite) {
      return res.status(404).json({ message: 'Favorite not found' });
    }

    const movieId = favorite.item_Id; // Get the movie ID before deleting the favorite

    await favorite.destroy();

    // Check if the movie is still referenced in the Favorites table
    const remainingFavorites = await Favorite.count({ where: { item_Id: movieId } });
    if (remainingFavorites === 0) {
      // No more references to this movie, safe to delete from the Movies table
      await Movie.destroy({ where: { id: movieId } });
    }

    res.status(200).json({ message: 'Favorite deleted successfully' });
  } catch (error) {
    console.error('Failed to delete favorite:', error);
    res.status(500).send('Failed to delete favorite.');
  }
});

module.exports = router;
