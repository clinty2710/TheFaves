// routes/Favorites.js

const express = require('express');
const { Favorite, Movie, Music, Book } = require('../models');
const router = express.Router();
const axios = require('axios');

const API_TOKEN = process.env.THEMOVIEDB_API_TOKEN;
const MUSIC_API_KEY = process.env.RAPIDAPI_KEY;
const MUSIC_BASE_URL = 'https://spotify23.p.rapidapi.com';

const musicApiClient = axios.create({
  baseURL: MUSIC_BASE_URL,
  headers: {
    'X-RapidAPI-Key': MUSIC_API_KEY,
    'X-RapidAPI-Host': 'spotify23.p.rapidapi.com',
  },
});

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
  const { user_Id, item_Id, item_Type, movieId, movieTitle, posterPath, musicId, musicTitle, coverImage, bookId, bookTitle, author } = req.body;
  console.log("Adding a new favorite:", req.body);

  try {
    if (item_Type === 'movie') {
      // Fetch movie details from TMDB to get release_date
      const movieDetailsResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
        params: { language: 'en-US' },
        headers: {
          'Authorization': API_TOKEN,
          'Accept': 'application/json'
        }
      });
      const movieDetails = movieDetailsResponse.data;
      console.log("Fetched movie details:", movieDetails);

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
        console.log("Inserted new movie into movies table:", movie);
      }

      // Insert the favorite into the favorites table
      const newFavorite = await Favorite.create({
        user_Id,
        item_Id: movieId,
        item_Type: item_Type,
      });
      console.log("Inserted new favorite into favorites table:", newFavorite);

      res.status(201).json(newFavorite);

    } else if (item_Type === 'music') {
      // Check if the music already exists in the music table
      let music = await Music.findOne({ where: { id: musicId } });
      if (!music) {
        // If the music doesn't exist, insert it into the music table
        music = await Music.create({
          id: musicId,
          title: musicTitle,
          cover_image: coverImage,
          artist: musicTitle.split(' by ')[1] || ''
        });
        console.log("Inserted new music into music table:", music);
      }

      // Insert the favorite into the favorites table
      const newFavorite = await Favorite.create({
        user_Id,
        item_Id: musicId,
        item_Type: item_Type,
      });
      console.log("Inserted new favorite into favorites table:", newFavorite);

      res.status(201).json(newFavorite);

    } else if (item_Type === 'book') {
      // Check if the book already exists in the books table
      let book = await Book.findOne({ where: { id: bookId } });
      if (!book) {
        // If the book doesn't exist, insert it into the books table
        book = await Book.create({
          id: bookId,
          title: bookTitle.split(' by ')[0],
          author: author,
          cover_image: coverImage
        });
        console.log("Inserted new book into books table:", book);
      }

      // Insert the favorite into the favorites table
      const newFavorite = await Favorite.create({
        user_Id,
        item_Id: bookId,
        item_Type: item_Type,
      });
      console.log("Inserted new favorite into favorites table:", newFavorite);

      res.status(201).json(newFavorite);
    }
  } catch (error) {
    console.error('Failed to add favorite:', error);
    res.status(500).json({ message: 'Failed to add to favorites', error: error.message });
  }
});

// Endpoint to fetch a user's favorites
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const favorites = await Favorite.findAll({
      where: { user_Id: userId },
      include: [
        {
          model: Movie,
          as: 'movie', // This should match the alias used in the association
        },
        {
          model: Music,
          as: 'music', // This should match the alias used in the association
        },
        {
          model: Book,
          as: 'book', // This should match the alias used in the association
        }
      ]
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

    const itemId = favorite.item_Id; // Get the item ID before deleting the favorite
    const itemType = favorite.item_Type;

    await favorite.destroy();

    // Check if the item is still referenced in the Favorites table
    const remainingFavorites = await Favorite.count({ where: { item_Id: itemId } });
    if (remainingFavorites === 0) {
      // No more references to this item, safe to delete from the respective table
      if (itemType === 'movie') {
        await Movie.destroy({ where: { id: itemId } });
      } else if (itemType === 'music') {
        await Music.destroy({ where: { id: itemId } });
      } else if (itemType === 'book') {
        await Book.destroy({ where: { id: itemId } });
      }
    }

    res.status(200).json({ message: 'Favorite deleted successfully' });
  } catch (error) {
    console.error('Failed to delete favorite:', error);
    res.status(500).send('Failed to delete favorite.');
  }
});

// Route to search music using Spotify API
router.get('/music/search', async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ message: "Query parameter is required." });
  }
  try {
    const response = await musicApiClient.get('/search', {
      params: {
        q: query,
        type: 'multi',
        offset: '0',
        limit: '10',
        numberOfTopResults: '5',
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Search API error:', error);
    res.status(500).json({ message: "Failed to fetch music", error: error.message });
  }
});

module.exports = router;