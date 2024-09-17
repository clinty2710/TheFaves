// models/music.js
// Clint Steadman

const mongoose = require('mongoose');

const musicSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true
  },
  release_year: {
    type: Number
  },
  cover_image: {
    type: String
  },
  artist: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Music', musicSchema);
