// models/music.js

const mongoose = require('mongoose');

const musicSchema = new mongoose.Schema({
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
