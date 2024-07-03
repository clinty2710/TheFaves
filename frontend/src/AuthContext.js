// src/AuthContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const getInitialAuthState = () => {
    const storedValue = localStorage.getItem('isAuthenticated');
    return storedValue === 'true';
  };

  const [isAuthenticated, setAuthenticated] = useState(getInitialAuthState);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/auth/check-session', { withCredentials: true });
        if (response.data && response.data.isAuthenticated) {
          setAuthenticated(true);
          localStorage.setItem('isAuthenticated', 'true');
        } else {
          setAuthenticated(false);
          localStorage.setItem('isAuthenticated', 'false');
        }
      } catch (error) {
        setAuthenticated(false);
        localStorage.setItem('isAuthenticated', 'false');
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
