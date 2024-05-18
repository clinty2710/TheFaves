// frontend/src/components/SearchMovies.js

import React, { useState, useEffect, useContext } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { searchMovies } from '../services/tmdbClient';
import { UserContext } from '../components/UserContext';

const SearchMovies = () => {
    const { user } = useContext(UserContext);
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState([]);
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        if (inputValue.length > 2) { 
            const delayDebounce = setTimeout(() => {
                searchMovies(inputValue).then(data => {
                    setOptions(data);
                });
            }, 500);
            return () => clearTimeout(delayDebounce);
        }
    }, [inputValue]);

    const handleInputChange = newValue => {
        setInputValue(newValue);
    };

    const handleAddToFavorites = async (movie) => {
        if (!user) {
            console.error('No user logged in');
            return;
        }
        try {
            const { data } = await axios.post('/api/favorites/add', {
                user_Id: user.id,
                item_Id: movie.value,
                item_Type: 'movie',
                movieId: movie.value,
                movieTitle: movie.label,
                posterPath: movie.poster
            });
            setFavorites([...favorites, data]);
        } catch (error) {
            console.error('Error adding to favorites:', error);
        }
    };

    const handleRemoveFavorite = async (favoriteId) => {
        try {
            await axios.post(`/api/favorites/delete/${favoriteId}`);
            setFavorites(favorites.filter(fav => fav.id !== favoriteId));
        } catch (error) {
            console.error('Error removing favorite:', error);
        }
    };

    return (
        <>
            <Select
                onInputChange={handleInputChange}
                onChange={handleAddToFavorites}
                options={options}
                placeholder="Search movies..."
                noOptionsMessage={() => 'No movies found'}
                isLoading={inputValue && options.length === 0}
            />
            <div className="favorites-container">
                {Array.isArray(favorites) && favorites.map(fav => (
                    <div key={fav.item_Id} className="favorite-item">
                        <img src={fav.posterPath} alt={fav.movieTitle} />
                        <p>{fav.movieTitle}</p>
                        <button onClick={() => handleRemoveFavorite(fav.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </>
    );
};

export default SearchMovies;
