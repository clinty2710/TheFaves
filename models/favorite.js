// models/favorite.js

const { Model, DataTypes } = require('sequelize');

class Favorite extends Model {
  static init(sequelize) {
    return super.init({
      user_Id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      item_Id: {
        type: DataTypes.INTEGER,
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
}

module.exports = Favorite;
