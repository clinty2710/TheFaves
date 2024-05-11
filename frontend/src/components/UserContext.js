// src/components/UserContext.js

import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Fetch user data from your API or handle authentication
        axios.get('/api/user')
            .then(response => setUser(response.data))
            .catch(error => console.error('Failed to fetch user', error));
    }, []);

    return (
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    );
};
