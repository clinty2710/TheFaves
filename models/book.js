// models/book.js
// Clint Steadman

const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  cover_image: {
    type: String
  }
});

module.exports = mongoose.model('Book', bookSchema);
