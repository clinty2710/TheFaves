// models/book.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookSchema = new Schema({
  _id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  cover_image: {
    type: String
  }
});

// Ensuring the index is not unique
bookSchema.index({ _id: 1 }, { unique: true }); // _id should remain unique
bookSchema.index({ title: 1, author: 1 }); // Example of a composite index

const Book = mongoose.model('Book', bookSchema);

// Function to handle index changes
async function ensureIndexes() {
  try {
    await Book.syncIndexes(); // Sync indexes to match schema
    console.log('Book indexes synchronized');
  } catch (error) {
    console.error('Error synchronizing book indexes:', error);
  }
}

// Export both the model and the function
module.exports = { Book, ensureIndexes };
