// models/favorite.js

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

class Favorite extends Model {
  static init(sequelize) {
    return super.init({
      user_Id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      item_Id: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      item_Type: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      sequelize,
      modelName: 'Favorite',
      timestamps: false
    });
  }

  static associate(models) {
    this.belongsTo(models.Movie, { foreignKey: 'item_Id', as: 'movie' });
    this.belongsTo(models.Music, { foreignKey: 'item_Id', as: 'music' });
    this.belongsTo(models.Book, { foreignKey: 'item_Id', as: 'book' });
  }
}

module.exports = Favorite;