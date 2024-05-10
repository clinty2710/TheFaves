// /frontend/src/components/SearchMovies.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';

const SearchMovies = () => {
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState([]);

    useEffect(() => {
        if (inputValue) {
            const loadOptions = async () => {
                const response = await axios.get(`/api/search/${inputValue}`);
                setOptions(response.data.map(movie => ({
                    label: `${movie.title} (${movie.release_date.split('-')[0]})`, // Shows title and year
                    value: movie.id,
                    poster: movie.poster_path
                })));
            };
            loadOptions();
        }
    }, [inputValue]);

    const handleInputChange = (newValue) => {
        setInputValue(newValue);
    };

    const handleChange = (selectedOption) => {
        // Add to favorites logic here
        console.log('Selected movie:', selectedOption);
        // Example: POST to your /favorites/create endpoint
    };

    return (
        <Select
            value={inputValue}
            onInputChange={handleInputChange}
            onChange={handleChange}
            options={options}
            placeholder="Search movies..."
            noOptionsMessage={() => 'No movies found'}
            isLoading={inputValue && options.length === 0}
        />
    );
};

export default SearchMovies;
