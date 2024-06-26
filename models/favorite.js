// models/favorite.js

const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  user_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  item_Id: {
    type: String,
    required: true
  },
  item_Type: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Favorite', favoriteSchema);
