// models/movie.js

const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    unique: true
  },
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
