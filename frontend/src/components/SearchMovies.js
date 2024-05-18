// frontend/src/components/SearchMovies.js

import React, { useState, useEffect, useContext } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { searchMovies } from '../services/tmdbClient';
import { UserContext } from './UserContext';

const SearchMovies = ({ favorites, setFavorites }) => {
    const { user } = useContext(UserContext);
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState([]);

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
        if (!user || !user.id) {
            console.error('No user logged in or user ID is missing');
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

    const handleRemoveFavorite = async (id) => {
        try {
            await axios.delete(`/api/favorites/delete/${id}`);
            setFavorites(favorites.filter(fav => fav.id !== id));
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
                    <div key={fav.id} className="favorite-item">
                        <img src={fav.movie.poster_path} alt={fav.movie.title} />
                        <p>{fav.movie.title}</p>
                        <button onClick={() => handleRemoveFavorite(fav.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </>
    );
};

export default SearchMovies;
