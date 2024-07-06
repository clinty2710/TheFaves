// models/movie.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

const movieSchema = new Schema({
  _id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true
  },
  release_date: {
    type: Date,
    required: true
  },
  poster_path: {
    type: String
  }
});

// Ensuring the index is not unique
movieSchema.index({ _id: 1 }, { unique: true }); // _id should remain unique
movieSchema.index({ title: 1, release_date: 1 }); // Example of a composite index

const Movie = mongoose.model('Movie', movieSchema);

// Function to handle index changes
async function ensureIndexes() {
  try {
    await Movie.syncIndexes(); // Sync indexes to match schema
    console.log('Movie indexes synchronized');
  } catch (error) {
    console.error('Error synchronizing movie indexes:', error);
  }
}

// Export both the model and the function
module.exports = { Movie, ensureIndexes };
