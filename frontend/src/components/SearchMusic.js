// frontend/src/components/SearchMusic.js

import React, { useState } from 'react';
import axios from 'axios';

const SearchMusic = ({ favorites, setFavorites }) => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;

    try {
      const response = await axios.get('/api/favorites/music/search', {
        params: { query },
      });
      console.log('Music search response:', response.data);

      const results = response.data.tracks.items.map((item) => ({
        id: item.data.id,
        title: item.data.name,
        artist: item.data.artists.items[0].profile.name,
        cover_image: item.data.albumOfTrack.coverArt.sources[0]?.url || '',
      }));
      setSearchResults(results);
      setError(null);
    } catch (err) {
      console.error('Failed to search music:', err);
      setError('Failed to search music');
      setSearchResults([]);
    }
  };

  const handleAddFavorite = async (music) => {
    try {
      const response = await axios.post('/api/favorites/add', {
        user_Id: 1, // Replace with the actual user ID from context or props
        item_Id: music.id,
        item_Type: 'music',
        musicId: music.id,
        musicTitle: `${music.title} by ${music.artist}`,
        coverImage: music.cover_image,
      });
      setFavorites([...favorites, response.data]);
    } catch (err) {
      console.error('Failed to add favorite:', err);
    }
  };

  return (
    <div>
      <h2>Search Music</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for music"
        />
        <button type="submit">Search</button>
      </form>
      {error && <p>{error}</p>}
      <div className="search-results">
        {searchResults.map((music) => (
          <div key={music.id} className="search-result-item">
            <img src={music.cover_image} alt={music.title} />
            <p>{music.title}</p>
            <p>{music.artist}</p>
            <button onClick={() => handleAddFavorite(music)}>Add to Favorites</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchMusic;
