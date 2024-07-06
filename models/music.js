// models/music.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

const musicSchema = new Schema({
  _id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true
  },
  release_year: {
    type: Number
  },
  cover_image: {
    type: String
  },
  artist: {
    type: String,
    required: true
  },
  cover_image: {
    type: String
  }
});

// Ensuring the index is not unique
musicSchema.index({ _id: 1 }, { unique: true }); // _id should remain unique
musicSchema.index({ title: 1, artist: 1 }); // Example of a composite index

const Music = mongoose.model('Music', musicSchema);

// Function to handle index changes
async function ensureIndexes() {
  try {
    await Music.syncIndexes(); // Sync indexes to match schema
    console.log('Music indexes synchronized');
  } catch (error) {
    console.error('Error synchronizing music indexes:', error);
  }
}

// Export both the model and the function
module.exports = { Music, ensureIndexes };
