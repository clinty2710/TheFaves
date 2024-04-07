//CreateFavorite.js

import React, { useState } from 'react';
import axios from 'axios';

const CreateFavorite = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/favorites/create', formData);
      console.log('Favorite item created:', response.data);
    } catch (error) {
      console.error('Failed to create favorite item:', error.message);
    }
  };

  return (
    <div>
      <h2>Add New Favorite Item</h2>
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
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default CreateFavorite;
