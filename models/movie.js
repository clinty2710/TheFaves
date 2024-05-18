// models/movie.js

const { Model, DataTypes } = require('sequelize');

class Movie extends Model {
  static init(sequelize) {
    return super.init({
      title: DataTypes.STRING,
      release_date: DataTypes.DATE,
      poster_path: DataTypes.STRING,
      description: DataTypes.TEXT
    }, {
      sequelize,
      modelName: 'Movie',
      timestamps: false
    });
  }
}

module.exports = Movie;
