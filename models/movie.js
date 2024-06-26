// models/movie.js

const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  release_date: {
    type: Date
  },
  poster_path: {
    type: String
  }
});

module.exports = mongoose.model('Movie', movieSchema);
