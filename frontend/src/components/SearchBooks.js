// src/components/SearchBooks.js

import React, { useState, useEffect, useContext } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { UserContext } from './UserContext';

const SearchBooks = ({ favorites, setFavorites }) => {
    const { user } = useContext(UserContext);
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState([]);

    useEffect(() => {
        if (inputValue.length > 2) {
            const delayDebounce = setTimeout(() => {
                axios.get('/api/favorites/books/search', {
                    params: { query: inputValue },
                    withCredentials: true
                }).then(response => {
                    const data = response.data.items.map(item => ({
                        value: item.id,
                        label: `${item.volumeInfo.title} by ${item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : 'Unknown'}`,
                        cover: item.volumeInfo.imageLinks?.thumbnail || '',
                        author: item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : 'Unknown'
                    }));
                    setOptions(data);
                }).catch(error => {
                    console.error('Search API error:', error);
                });
            }, 500);
            return () => clearTimeout(delayDebounce);
        }
    }, [inputValue]);

    const handleInputChange = newValue => {
        setInputValue(newValue);
    };

    const handleAddToFavorites = async (book) => {
        if (!user || !user._id) {
            console.error('No user logged in or user ID is missing');
            return;
        }
        try {
            const { data } = await axios.post('/api/favorites/add', {
                user_Id: user._id,
                item_Id: book.value,
                item_Type: 'book',
                bookId: book.value,
                bookTitle: book.label,
                coverImage: book.cover,
                author: book.author
            }, {
                withCredentials: true
            });
            setFavorites([...favorites, { ...data, book: { cover_image: book.cover, title: book.label, author: book.author } }]);
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
                placeholder="Search books..."
                noOptionsMessage={() => 'No books found'}
                isLoading={inputValue && options.length === 0}
            />
        </div>
    );
};

export default SearchBooks;
