// src/components/UserContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('/auth/profile', { withCredentials: true });
        setUser(response.data);
        console.log("User data set in UserContext:", response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.log('User not authenticated');
          setUser(null); // Ensure user is set to null if not authenticated
        } else {
          console.error('Failed to fetch user', error);
        }
      }
    };

    if (isAuthenticated) {
      fetchUser();
    }
  }, [isAuthenticated]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
