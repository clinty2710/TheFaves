// models/favorite.js

const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
  user_Id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  item_Id: { type: String, required: true },
  item_Type: { type: String, required: true },
  movie: {
    title: String,
    poster_path: String
  },
  music: {
    title: String,
    cover_image: String
  },
  book: {
    title: String,
    author: String,
    cover_image: String
  }
});

const Favorite = mongoose.model('Favorite', FavoriteSchema);
module.exports = Favorite;
