// /frontend/src/components/SearchMovies.js

import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { searchMovies } from '../services/tmdbClient';

const SearchMovies = () => {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (inputValue) {
      searchMovies(inputValue, currentPage)
        .then(data => {
          const newOptions = data.results.map(movie => ({
            label: `${movie.title} (${movie.release_date ? movie.release_date.split('-')[0] : 'N/A'})`,
            value: movie.id
          }));
          if (currentPage > 1) {
            setOptions(prev => [...prev, ...newOptions]);
          } else {
            setOptions(newOptions);
          }
          setTotalPages(data.totalPages);
        })
        .catch(error => {
          console.error('Error fetching movies:', error);
        });
    }
  }, [inputValue, currentPage]);

  const handleInputChange = newValue => {
    setInputValue(newValue);
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <Select
      onInputChange={handleInputChange}
      onChange={selectedOption => console.log('Selected movie:', selectedOption)}
      options={options}
      placeholder="Search movies..."
      noOptionsMessage={() => 'No movies found'}
      isLoading={inputValue && options.length === 0}
      // You might add a button or scroll event to trigger handleLoadMore
    />
  );
};

export default SearchMovies;
