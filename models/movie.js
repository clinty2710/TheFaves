// models/movie.js

const { Model, DataTypes } = require('sequelize');

class Movie extends Model {
  static associate(models) {
    // Define associations here if needed
  }
}

module.exports = (sequelize) => {
  Movie.init(
    {
      title: DataTypes.STRING,
      release_date: DataTypes.DATE,
      poster_path: DataTypes.STRING,
      description: DataTypes.TEXT,
    },
    { sequelize, modelName: 'Movie', timestamps: false }
  );
  return Movie;
};
