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
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Movies', // Name of the Movies table
          key: 'id'
        }
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
  }
}

module.exports = Favorite;
