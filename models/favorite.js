const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database/connection'); 

class Favorite extends Model {}

Favorite.init({
  userId: DataTypes.INTEGER,
  itemId: DataTypes.INTEGER,
  itemType: DataTypes.STRING,  // 'movie', 'music', 'book'
  movieId: DataTypes.INTEGER,  // Specific for movies
  movieTitle: DataTypes.STRING,  // Specific for movies
  posterPath: DataTypes.STRING  // Specific for movies
}, { sequelize, modelName: 'Favorite' });

module.exports = Favorite;