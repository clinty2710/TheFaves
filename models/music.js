// models/music.js

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

class Music extends Model {
  static init(sequelize) {
    return super.init({
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      release_year: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      cover_image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      artist: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    }, {
      sequelize,
      modelName: 'Music',
      timestamps: false,
    });
  }

  static associate(models) {
    this.hasMany(models.Favorite, { foreignKey: 'item_Id', as: 'favorites' });
  }
}

module.exports = Music;
