// AuthContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Safely parse the value from localStorage
  const getInitialAuthState = () => {
    const storedValue = localStorage.getItem('isAuthenticated');
    if (storedValue === null) return false;
    try {
      return JSON.parse(storedValue);
    } catch (error) {
      console.error('Error parsing isAuthenticated from localStorage', error);
      return false;
    }
  };

  const [isAuthenticated, setAuthenticated] = useState(getInitialAuthState);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/auth/check-session');
        if (response.data && typeof response.data.isAuthenticated !== 'undefined') {
          setAuthenticated(response.data.isAuthenticated);
          localStorage.setItem('isAuthenticated', JSON.stringify(response.data.isAuthenticated));
        } else {
          throw new Error('Invalid response structure');
        }
      } catch (error) {
        setAuthenticated(false);
        localStorage.setItem('isAuthenticated', JSON.stringify(false));
        console.error('Error during authentication check:', error);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
