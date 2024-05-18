// src/components/Profile.js

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import LogoutButton from './LogoutButton';
import { useAuth } from '../AuthContext';
import { UserContext } from './UserContext';
import SearchMovies from './SearchMovies';

const Profile = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const { isAuthenticated } = useAuth();
    const { user, setUser } = useContext(UserContext);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/auth/profile');
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
        const fetchFavorites = async () => {
            if (user && user.id) {
                try {
                    const response = await axios.get(`/api/favorites/user/${user.id}`);
                    setFavorites(response.data);
                } catch (error) {
                    console.error('Failed to fetch favorites:', error);
                }
            }
        };

        if (user && user.id) {
            fetchFavorites();
        }
    }, [user]);

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
            <h2>Welcome, {user.nickname}!</h2>
            <p>Email: {user.email}</p>
            <SearchMovies favorites={favorites} setFavorites={setFavorites} />  {/* Pass favorites as props */}
            <div className="favorites-container">
                {favorites.map(fav => (
                    <div key={fav.id} className="favorite-item">
                        <img src={fav.movie.poster_path} alt={fav.movie.title} />
                        <p>{fav.movie.title}</p>
                        <button onClick={() => handleRemoveFavorite(fav.id)}>Delete</button>
                    </div>
                ))}
            </div>
            <LogoutButton />
        </div>
    );
};

export default Profile;
