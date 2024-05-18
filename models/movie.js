// models/movie.js

const { Model, DataTypes } = require('sequelize');

class Movie extends Model {
  static init(sequelize) {
    return super.init({
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      release_date: {
        type: DataTypes.DATE,
      },
      poster_path: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.TEXT,
      },
    }, {
      sequelize,
      modelName: 'Movie',
      timestamps: false,
    });
  }
}

module.exports = Movie;
