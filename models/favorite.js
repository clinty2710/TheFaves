// models/favorite.js

const { Model, DataTypes } = require('sequelize');

class Favorite extends Model {}

module.exports = (sequelize) => {
  Favorite.init(
    {
      userId: DataTypes.INTEGER,
      itemId: DataTypes.INTEGER,
      itemType: DataTypes.STRING,  // 'movie', 'music', 'book'
    },
    { sequelize, modelName: 'Favorite', timestamps: false }
  );
  return Favorite;
};
