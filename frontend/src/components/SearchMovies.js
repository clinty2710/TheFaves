// frontend/src/components/SearchMovies.js
// Clint Steadman

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
        if (!user || !user._id) {
            console.error('No user logged in or user ID is missing');
            return;
        }
        try {
            console.log('Attempting to add movie to favorites:', movie);
            const { data } = await axios.post('/api/favorites/add', {
                user_Id: user._id,
                item_Id: movie._id, // Use _id from the movie object
                item_Type: 'movie',
                movieId: movie._id, // Use _id from the movie object
                movieTitle: movie.title,
                posterPath: movie.poster_path
            }, {
                withCredentials: true
            });
            console.log('Successfully added to favorites:', data);
            setFavorites([...favorites, { ...data, movie: { poster_path: movie.poster_path, title: movie.title } }]);
        } catch (error) {
            console.error('Error adding to favorites:', error);
        }
    };

    return (
        <div className="search-container">
            <Select
                classNamePrefix="select"
                onInputChange={handleInputChange}
                onChange={handleAddToFavorites}
                options={options}
                placeholder="Search movies..."
                noOptionsMessage={() => 'No movies found'}
                isLoading={inputValue && options.length === 0}
                getOptionLabel={(option) => option.title}
                getOptionValue={(option) => option._id} // Use _id as the value
            />
        </div>
    );
};

export default SearchMovies;
