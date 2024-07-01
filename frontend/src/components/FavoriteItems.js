// src/components/FavoriteItems.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FavoriteItems = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get('/favorites');
        setFavorites(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching favorite items:", err);
        setError('Failed to load favorite items.');
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  if (loading) return <div>Loading favorite items...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>My Favorite Items</h2>
      <ul>
        {favorites.map(item => (
          <li key={item.id}>{item.title} - {item.description}</li>
        ))}
      </ul>
    </div>
  );
}

export default FavoriteItems;
