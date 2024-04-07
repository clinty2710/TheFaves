// src/components/DeleteFavorite.js

import React from 'react';
import axios from 'axios';

const DeleteFavorite = ({ favoriteId }) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`/favorites/${favoriteId}`); // Update endpoint as per your backend
      console.log('Favorite item deleted');
      // Optionally, you can trigger a refresh of the favorite items list after deletion
    } catch (error) {
      console.error('Failed to delete favorite item:', error.message);
    }
  };

  return (
    <div>
      <h2>Delete Favorite Item</h2>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default DeleteFavorite;
