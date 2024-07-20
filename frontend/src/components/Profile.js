// src/components/Profile.js

import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useUser } from './UserContext';
import LogoutButton from './LogoutButton';
import SearchMovies from './SearchMovies';
import SearchMusic from './SearchMusic';
import SearchBooks from './SearchBooks';
import { getUserProfile } from '../services/api';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const { isAuthenticated } = useAuth();
  const { user, setUser } = useUser();

  useEffect(() => {
    // Force a reload when the component mounts
    if (!window.location.hash) {
      window.location = window.location + '#loaded';
      window.location.reload();
    }
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      console.log("Fetching user profile...");
      try {
        setLoading(true);
        const response = await getUserProfile();
        console.log("Profile data received:", response);
        if (response) {
          setUser(response);
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
      if (user && user._id) {
        try {
          const response = await axios.get(`/api/favorites/user/${user._id}`, { withCredentials: true });
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
      await axios.delete(`/api/favorites/delete/${id}`, { withCredentials: true });
      setFavorites(favorites.filter(fav => fav._id !== id));
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
  console.log("Favorites data:", favorites);

  return (
    <div>
      <header className="profile-header">
        <div className="logo">
          <span className="my">my</span>
          <span className="f">F</span>
          <span className="a">A</span>
          <span className="heart-v"></span>
          <span className="e">E</span>
          <span className="s">S</span>
        </div>
        <span className="welcome-message">Welcome, {user.nickname}!</span>
      </header>
      <h2>Favorite Movies</h2>
      <SearchMovies favorites={favorites} setFavorites={setFavorites} />
      <div className="favorites-container">
        {Array.isArray(favorites) && favorites.filter(fav => fav.item_Type === 'movie').map(fav => (
          <div key={fav._id} className="favorite-item">
            {fav.movie && fav.movie.poster_path ? (
              <img src={`https://image.tmdb.org/t/p/w500${fav.movie.poster_path}`} alt={fav.movie.title} />
            ) : (
              <div>No poster available</div>
            )}
            <p>{fav.movie ? fav.movie.title : 'No Title'}</p>
            <i className="fas fa-trash-alt delete-icon" onClick={() => handleRemoveFavorite(fav._id)}></i>
          </div>
        ))}
      </div>
      <h2>Favorite Music</h2>
      <SearchMusic favorites={favorites} setFavorites={setFavorites} />
      <div className="favorites-container">
        {Array.isArray(favorites) && favorites.filter(fav => fav.item_Type === 'music').map(fav => (
          <div key={fav._id} className="favorite-item">
            {fav.music && fav.music.cover_image ? (
              <img src={fav.music.cover_image} alt={fav.music.title} />
            ) : (
              <div>No cover available</div>
            )}
            <p>{fav.music ? fav.music.title : 'No Title'}</p>
            <i className="fas fa-trash-alt delete-icon" onClick={() => handleRemoveFavorite(fav._id)}></i>
          </div>
        ))}
      </div>
      <h2>Favorite Books</h2>
      <SearchBooks favorites={favorites} setFavorites={setFavorites} />
      <div className="favorites-container">
        {Array.isArray(favorites) && favorites.filter(fav => fav.item_Type === 'book').map(fav => (
          <div key={fav._id} className="favorite-item">
            {fav.book && fav.book.cover_image ? (
              <img src={fav.book.cover_image} alt={fav.book.title} />
            ) : (
              <div>No cover available</div>
            )}
            <p>{fav.book ? fav.book.title : 'No Title'}</p>
            <p>{fav.book ? fav.book.author : 'Unknown Author'}</p>
            <i className="fas fa-trash-alt delete-icon" onClick={() => handleRemoveFavorite(fav._id)}></i>
          </div>
        ))}
      </div>
      <LogoutButton />
    </div>
  );
};

export default Profile;
