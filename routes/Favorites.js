// routes/Favorites.js

const express = require('express');
const { Favorite } = require('../models/favorite'); // Ensure this path is correct
const router = express.Router();

// Route to search movies
router.get('/movies/search', async (req, res) => {
  const { query } = req.query; // Get search term from query parameters
  if (!query) {
    return res.status(400).json({ message: "Query parameter is required." });
  }
  const movies = await searchMovies(query);
  res.json(movies);
});

// Route to get details of a specific movie
router.get('/movies/details/:id', async (req, res) => {
  const { id } = req.params; // Get movie ID from route parameters
  const movieDetails = await getMovieDetails(id);
  if (movieDetails) {
    res.json(movieDetails);
  } else {
    res.status(404).json({ message: "Movie not found." });
  }
});

// Existing routes for handling favorites
router.get('/', async (req, res) => {
  try {
    const favorites = await Favorite.findAll({
      where: { userId: req.user.id } // Assumes you have authentication and req.user is available
    });
    res.json(favorites);
  } catch (error) {
    console.error('Failed to retrieve favorites:', error);
    res.status(500).send('Failed to retrieve favorite items.');
  }
});

router.post('/create', async (req, res) => {
  try {
    const { title, description, itemId, itemType } = req.body;
    const newFavorite = await Favorite.create({
      userId: req.user.id,
      title,
      description,
      itemId,
      itemType
    });
    res.status(201).json(newFavorite);
  } catch (error) {
    console.error('Failed to create favorite:', error);
    res.status(500).send('Failed to create favorite item.');
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { title, description } = req.body;
    const updated = await Favorite.update({ title, description }, {
      where: { id: req.params.id, userId: req.user.id }
    });
    if (updated) {
      res.send({ message: 'Favorite item updated successfully.' });
    } else {
      throw new Error('Favorite item not found.');
    }
  } catch (error) {
    console.error('Failed to update favorite:', error);
    res.status(500).send('Failed to update favorite item.');
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Favorite.destroy({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (deleted) {
      res.send({ message: 'Favorite item deleted successfully.' });
    } else {
      throw new Error('Favorite item not found.');
    }
  } catch (error) {
    console.error('Failed to delete favorite:', error);
    res.status(500).send('Failed to delete favorite item.');
  }
});

module.exports = router;
