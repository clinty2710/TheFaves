// frontend/src/components/SearchMusic.js

import React, { useState, useEffect, useContext } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { UserContext } from './UserContext';

const SearchMusic = ({ favorites, setFavorites }) => {
    const { user } = useContext(UserContext);
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState([]);

    useEffect(() => {
        if (inputValue.length > 2) {
            const delayDebounce = setTimeout(() => {
                axios.get('/api/favorites/music/search', {
                    params: { query: inputValue }
                }).then(response => {
                    const data = response.data.tracks.items.map(item => ({
                        value: item.data.id,
                        label: `${item.data.name} by ${item.data.artists.items[0].profile.name}`,
                        cover: item.data.albumOfTrack.coverArt.sources[0]?.url || '',
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

    const handleAddToFavorites = async (music) => {
        if (!user || !user.id) {
            console.error('No user logged in or user ID is missing');
            return;
        }
        try {
            const { data } = await axios.post('/api/favorites/add', {
                user_Id: user.id,
                item_Id: music.value,
                item_Type: 'music',
                musicId: music.value,
                musicTitle: music.label,
                coverImage: music.cover
            });
            setFavorites([...favorites, { ...data, music: { cover_image: music.cover, title: music.label } }]);
        } catch (error) {
            console.error('Error adding to favorites:', error);
        }
    };

    return (
        <>
            <Select
                onInputChange={handleInputChange}
                onChange={handleAddToFavorites}
                options={options}
                placeholder="Search music..."
                noOptionsMessage={() => 'No music found'}
                isLoading={inputValue && options.length === 0}
            />
        </>
    );
};

export default SearchMusic;
