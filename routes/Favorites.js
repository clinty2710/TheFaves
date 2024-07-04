// routes/Favorites.js

const express = require('express');
const router = express.Router();
const axios = require('axios');
const { Favorite, Movie, Music, Book } = require('../models');

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
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
      params: { query, include_adult: false, language: 'en-US' },
      headers: { 'Authorization': API_TOKEN, 'Accept': 'application/json' }
    });
    res.json(response.data.results);
  } catch (error) {
    console.error('Search API error:', error);
    res.status(500).json({ message: "Failed to fetch movies", error: error.message });
  }
});

router.post('/add', async (req, res) => {
  const { user_Id, item_Id, item_Type, movieId, movieTitle, posterPath, musicId, musicTitle, coverImage, bookId, bookTitle, author } = req.body;
  
  try {
    if (item_Type === 'movie') {
      const movieDetailsResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
        params: { language: 'en-US' },
        headers: { 'Authorization': API_TOKEN, 'Accept': 'application/json' }
      });
      const movieDetails = movieDetailsResponse.data;

      let movie = await Movie.findOne({ _id: movieId });
      if (!movie) {
        movie = new Movie({
          _id: movieId,
          title: movieTitle,
          release_date: movieDetails.release_date || null,
          poster_path: posterPath,
        });
        await movie.save();
      }

      const newFavorite = new Favorite({
        user_Id,
        item_Id: movieId,
        item_Type: item_Type,
      });
      await newFavorite.save();
      res.status(201).json(newFavorite);

    } else if (item_Type === 'music') {
      let music = await Music.findOne({ _id: musicId });
      if (!music) {
        music = new Music({
          _id: musicId,
          title: musicTitle,
          cover_image: coverImage,
          artist: musicTitle.split(' by ')[1] || ''
        });
        await music.save();
      }

      const newFavorite = new Favorite({
        user_Id,
        item_Id: musicId,
        item_Type: item_Type,
      });
      await newFavorite.save();
      res.status(201).json(newFavorite);

    } else if (item_Type === 'book') {
      let book = await Book.findOne({ _id: bookId });
      if (!book) {
        book = new Book({
          _id: bookId,
          title: bookTitle.split(' by ')[0],
          author: author,
          cover_image: coverImage
        });
        await book.save();
      }

      const newFavorite = new Favorite({
        user_Id,
        item_Id: bookId,
        item_Type: item_Type,
      });
      await newFavorite.save();
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
    const favorites = await Favorite.find({ user_Id: userId })
      .populate('movie')
      .populate('music')
      .populate('book')
      .exec();

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
    const favorite = await Favorite.findById(id);
    if (!favorite) {
      return res.status(404).json({ message: 'Favorite not found' });
    }

    const itemId = favorite.item_Id;
    const itemType = favorite.item_Type;

    await favorite.remove();

    const remainingFavorites = await Favorite.countDocuments({ item_Id: itemId });
    if (remainingFavorites === 0) {
      if (itemType === 'movie') {
        await Movie.deleteOne({ _id: itemId });
      } else if (itemType === 'music') {
        await Music.deleteOne({ _id: itemId });
      } else if (itemType === 'book') {
        await Book.deleteOne({ _id: itemId });
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
