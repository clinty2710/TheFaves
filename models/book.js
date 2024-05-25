// models/book.js

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

class Book extends Model {
    static init(sequelize) {
      return super.init({
        id: {
          type: DataTypes.STRING(50),
          allowNull: false,
          primaryKey: true
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false
        },
        author: {
          type: DataTypes.STRING,
          allowNull: false
        },
        cover_image: {
          type: DataTypes.STRING,
          allowNull: true
        }
      }, {
        sequelize,
        modelName: 'Book',
        timestamps: false,
      });
    }
  
    static associate(models) {
      this.hasMany(models.Favorite, { foreignKey: 'book_id', as: 'favorites' });
    }
  }
  
  module.exports = Book;