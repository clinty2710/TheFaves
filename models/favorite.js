// models/favorite.js

const { Model, DataTypes } = require('sequelize');

class Favorite extends Model {}

module.exports = (sequelize) => {
  Favorite.init(
    {
      user_Id: DataTypes.INTEGER,
      item_Id: DataTypes.INTEGER,
      item_Type: DataTypes.STRING,  // 'movie', 'music', 'book'
    },
    { sequelize, modelName: 'Favorite', timestamps: false }
  );
  return Favorite;
};
