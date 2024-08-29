//Profile.js

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
    window.scrollTo(0, 0); // Scrolls to top on mount
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      console.log("Fetching user profile...");
      try {
        setLoading(true);
        const response = await getUserProfile();
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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>No user data available</div>;
  }

  return (
    <div>
      <header className="profile-header">
        <div className="logo">
          <span className="my">my</span><span className="f">F</span><span className="a">A</span>
          <span className="heart-v"></span><span className="e">E</span><span className="s">S</span>
        </div>
        <span className="welcome-message">Welcome, {user.nickname}!</span>
      </header>
      <div className="search-column">
        <div className="search-container">
          <h2>Favorite Movies</h2>
          <SearchMovies favorites={favorites} setFavorites={setFavorites} />
        </div>
        <div className="search-container">
          <h2>Favorite Music</h2>
          <SearchMusic favorites={favorites} setFavorites={setFavorites} />
        </div>
        <div className="search-container">
          <h2>Favorite Books</h2>
          <SearchBooks favorites={favorites} setFavorites={setFavorites} />
        </div>
      </div>
      <div className="content-column">
        {favorites.map(fav => (
          <div key={fav._id} className="favorite-item">
            <img src={fav.type === 'movie' ? fav.image : fav.type === 'music' ? fav.cover_image : fav.book_cover} alt={fav.title} />
            <p>{fav.title}</p>
            <i className="fas fa-trash-alt delete-icon" onClick={() => handleRemoveFavorite(fav._id)}></i>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
