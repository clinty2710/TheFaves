// models/favorite.js

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

class Favorite extends Model {}

Favorite.init({
  userId: DataTypes.INTEGER,
  title: DataTypes.STRING,
  description: DataTypes.STRING,
  itemId: DataTypes.STRING,
  itemType: DataTypes.STRING // 'movie', 'music', or 'book'
}, { sequelize, modelName: 'Favorite' });

module.exports = Favorite;
