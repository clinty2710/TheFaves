// models/index.js
// Clint Steadman

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const basename = path.basename(__filename);
const db = {};

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected.");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error; // Ensure the error is caught in the server setup
  }
};

// Read all model files in the current directory (except index.js) and require them
fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file));
    db[model.modelName] = model;
  });

module.exports = { connectDB, db };
