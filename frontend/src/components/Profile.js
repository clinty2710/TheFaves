// src/components/Profile.js

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import LogoutButton from './LogoutButton';
import { useAuth } from '../AuthContext';
import { useUser } from './UserContext';
import SearchMovies from './SearchMovies';
import SearchMusic from './SearchMusic';
import SearchBooks from './SearchBooks';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const { isAuthenticated } = useAuth();
  const { user, setUser } = useUser();

  useEffect(() => {
    const fetchUserProfile = async () => {
      console.log("Fetching user profile...");
      try {
        setLoading(true);
        const response = await axios.get('/auth/profile');
        console.log("Profile data received:", response.data);
        if (response.data) {
          setUser(response.data);
          setError(null);
        } else {
          throw new Error('Failed to fetch profile data');
        }
      } catch (error) {
        console.error('Profile fetch error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, setUser]);

  useEffect(() => {
    const fetchUserFavorites = async () => {
      if (user && user._id) {  // Changed from user.id to user._id
        try {
          const response = await axios.get(`/api/favorites/user/${user._id}`);  // Changed from user.id to user._id
          console.log("User favorites fetched:", response.data);
          setFavorites(response.data);
        } catch (error) {
          console.error('Failed to fetch favorites:', error);
        }
      }
    };

    if (user) {
      fetchUserFavorites();
    }
  }, [user]);

  const handleRemoveFavorite = async (id) => {
    try {
      await axios.delete(`/api/favorites/delete/${id}`);
      setFavorites(favorites.filter(fav => fav.id !== id));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  if (loading) {
    console.log("Loading Profile...");
    return <div>Loading...</div>;
  }

  if (error) {
    console.log("Error loading profile:", error);
    return <div>Error: {error}</div>;
  }

  if (!user) {
    console.log("No user data received");
    return <div>No user data available</div>;
  }

  console.log("User data available:", user);

  return (
    <div>
      <h2>Welcome, {user.nickname}!</h2>
      <h2>Favorite Movies</h2>
      <SearchMovies favorites={favorites} setFavorites={setFavorites} />
      <div className="favorites-container">
        {Array.isArray(favorites) && favorites.filter(fav => fav.item_Type === 'movie').map(fav => (
          <div key={fav.id} className="favorite-item">
            <img src={fav.movie.poster_path} alt={fav.movie.title} />
            <p>{fav.movie.title}</p>
            <i className="fas fa-trash-alt delete-icon" onClick={() => handleRemoveFavorite(fav.id)}></i>
          </div>
        ))}
      </div>
      <h2>Favorite Music</h2>
      <SearchMusic favorites={favorites} setFavorites={setFavorites} />
      <div className="favorites-container">
        {Array.isArray(favorites) && favorites.filter(fav => fav.item_Type === 'music').map(fav => (
          <div key={fav.id} className="favorite-item">
            <img src={fav.music.cover_image} alt={fav.music.title} />
            <p>{fav.music.title}</p>
            <i className="fas fa-trash-alt delete-icon" onClick={() => handleRemoveFavorite(fav.id)}></i>
          </div>
        ))}
      </div>
      <h2>Favorite Books</h2>
      <SearchBooks favorites={favorites} setFavorites={setFavorites} />
      <div className="favorites-container">
        {Array.isArray(favorites) && favorites.filter(fav => fav.item_Type === 'book').map(fav => (
          <div key={fav.id} className="favorite-item">
            <img src={fav.book.cover_image} alt={fav.book.title} />
            <p>{fav.book.title}</p>
            <p>{fav.book.author}</p>
            <i className="fas fa-trash-alt delete-icon" onClick={() => handleRemoveFavorite(fav.id)}></i>
          </div>
        ))}
      </div>
      <LogoutButton />
    </div>
  );
};

export default Profile;
