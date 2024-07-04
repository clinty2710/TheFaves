// src/components/FavoriteItems.js

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';

const FavoriteItems = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user || !user._id) {
        setError('No user logged in or user ID is missing.');
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(`/api/favorites/user/${user._id}`, { withCredentials: true });
        setFavorites(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching favorite items:", err);
        setError('Failed to load favorite items.');
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  if (loading) return <div>Loading favorite items...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>My Favorite Items</h2>
      <ul>
        {favorites.map(item => (
          <li key={item._id}>
            {item.item_Type === 'book' && `${item.book.title} by ${item.book.author}`}
            {item.item_Type === 'movie' && `${item.movie.title}`}
            {item.item_Type === 'music' && `${item.music.title} by ${item.music.artist}`}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FavoriteItems;
