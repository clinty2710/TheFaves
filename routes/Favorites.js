// routes/Favorites.js

const express = require('express');
const router = express.Router();
const axios = require('axios');
const { db } = require('../models');
const { Favorite, Movie, Music, Book } = db;

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

router.post('/add', async (req, res) => {
  const { user_Id, item_Type, movieId, movieTitle, posterPath, musicId, musicTitle, coverImage, bookId, bookTitle, author } = req.body;

  try {
    console.log('Add favorite request body:', req.body);

    if (item_Type === 'movie') {
      console.log('Processing movie favorite');
      const movieDetailsResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
        params: { language: 'en-US' },
        headers: { 'Authorization': `${API_TOKEN}`, 'Accept': 'application/json' }
      });
      const movieDetails = movieDetailsResponse.data;
      console.log('Fetched movie details:', movieDetails);

      let movie = await Movie.findOne({ _id: movieId });
      if (!movie) {
        movie = new Movie({
          _id: movieId,
          title: movieTitle,
          release_date: movieDetails.release_date || null,
          poster_path: posterPath,
        });
        await movie.save();
        console.log('Saved new movie to database:', movie);
      }

      const newFavorite = new Favorite({
        user_Id,
        item_Id: movieId,
        item_Type: item_Type,
        movie: {
          title: movieTitle,
          poster_path: posterPath
        }
      });
      await newFavorite.save();
      console.log('Saved new favorite to database:', newFavorite);
      res.status(201).json(newFavorite);

    } else if (item_Type === 'music') {
      console.log('Processing music favorite');
      let music = await Music.findOne({ _id: musicId });
      if (!music) {
        music = new Music({
          _id: musicId,
          title: musicTitle,
          cover_image: coverImage,
          artist: musicTitle.split(' by ')[1] || ''
        });
        await music.save();
        console.log('Saved new music to database:', music);
      }

      const newFavorite = new Favorite({
        user_Id,
        item_Id: musicId,
        item_Type: item_Type,
        music: {
          title: musicTitle,
          cover_image: coverImage
        }
      });
      await newFavorite.save();
      console.log('Saved new favorite to database:', newFavorite);
      res.status(201).json(newFavorite);

    } else if (item_Type === 'book') {
      console.log('Processing book favorite');
      let book = await Book.findOne({ _id: bookId });
      if (!book) {
        const [title, authorName] = bookTitle.split(' by ');
        book = new Book({
          _id: bookId,
          title: title || bookTitle,
          author: authorName || author,
          cover_image: coverImage
        });
        await book.save();
        console.log('Saved new book to database:', book);
      }

      const newFavorite = new Favorite({
        user_Id,
        item_Id: bookId,
        item_Type: item_Type,
        book: {
          title: title || bookTitle,
          author: authorName || author,
          cover_image: coverImage
        }
      });
      await newFavorite.save();
      console.log('Saved new favorite to database:', newFavorite);
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
  console.log(`Fetching favorites for user ${userId}`);

  try {
    const favorites = await Favorite.find({ user_Id: userId }).lean();

    const populatedFavorites = await Promise.all(favorites.map(async (favorite) => {
      if (favorite.item_Type === 'movie') {
        const movie = await Movie.findById(favorite.item_Id);
        return { ...favorite, movie };
      } else if (favorite.item_Type === 'music') {
        const music = await Music.findById(favorite.item_Id);
        return { ...favorite, music };
      } else if (favorite.item_Type === 'book') {
        const book = await Book.findById(favorite.item_Id);
        return { ...favorite, book };
      }
      return favorite;
    }));

    console.log('Fetched favorites:', populatedFavorites);
    res.json(populatedFavorites);
  } catch (error) {
    console.error('Failed to fetch favorites:', error);
    res.status(500).send('Failed to fetch favorites.');
  }
});

// Endpoint to delete a favorite
router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`Deleting favorite with id ${id}`);

  try {
    const favorite = await Favorite.findById(id);
    if (!favorite) {
      return res.status(404).json({ message: 'Favorite not found' });
    }

    const itemId = favorite.item_Id;
    const itemType = favorite.item_Type;

    await Favorite.deleteOne({ _id: id }); // Use deleteOne instead of remove

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

// Route to search movies using TMDB API
router.get('/movies/search', async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ message: "Query parameter is required." });
  }
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
      params: { query, include_adult: false, language: 'en-US' },
      headers: { 'Authorization': `Bearer ${API_TOKEN}`, 'Accept': 'application/json' }
    });
    res.json(response.data.results);
  } catch (error) {
    console.error('Search API error:', error);
    res.status(500).json({ message: "Failed to fetch movies", error: error.message });
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

// Proxy route for Google Books API
router.get('/books/search', async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ message: "Query parameter is required." });
  }

  try {
    const response = await axios.get(`https://www.googleapis.com/books/v1/volumes`, {
      params: {
        q: query,
        key: process.env.REACT_APP_GOOGLE_BOOKS_API_KEY
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Google Books API error:', error);
    res.status(500).json({ message: "Failed to fetch books", error: error.message });
  }
});

module.exports = router;
