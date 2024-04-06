// src/components/ReadFavorites.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ReadFavorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get('/favorites'); // Update endpoint as per your backend
        setFavorites(response.data);
      } catch (error) {
        console.error('Failed to fetch favorite items:', error.message);
      }
    };

    fetchFavorites();
  }, []);

  return (
    <div>
      <h2>Favorite Items</h2>
      <ul>
        {favorites.map((favorite) => (
          <li key={favorite.id}>{favorite.title} ({favorite.category})</li>
        ))}
      </ul>
    </div>
  );
};

export default ReadFavorites;
