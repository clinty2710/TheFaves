// src/components/UpdateFavorite.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UpdateFavorite = ({ favoriteId }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '', // This could be 'movie', 'music', or 'book'
    // Add more fields as needed
  });

  useEffect(() => {
    const fetchFavorite = async () => {
      try {
        const response = await axios.get(`/favorites/${favoriteId}`); // Update endpoint as per your backend
        setFormData(response.data);
      } catch (error) {
        console.error('Failed to fetch favorite item:', error.message);
      }
    };

    fetchFavorite();
  }, [favoriteId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`/favorites/${favoriteId}`, formData); // Update endpoint as per your backend
      console.log('Favorite item updated:', response.data);
    } catch (error) {
      console.error('Failed to update favorite item:', error.message);
    }
  };

  return (
    <div>
      <h2>Update Favorite Item</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Category:</label>
          <select name="category" value={formData.category} onChange={handleChange} required>
            <option value="">Select Category</option>
            <option value="movie">Movie</option>
            <option value="music">Music</option>
            <option value="book">Book</option>
          </select>
        </div>
        {/* Add more input fields as needed */}
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default UpdateFavorite;
