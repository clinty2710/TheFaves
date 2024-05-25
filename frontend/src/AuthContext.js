// AuthContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setAuthenticated] = useState(
    JSON.parse(localStorage.getItem('isAuthenticated')) || false
  );

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/auth/check-session');
        setAuthenticated(response.data.isAuthenticated);
        localStorage.setItem('isAuthenticated', JSON.stringify(response.data.isAuthenticated));
      } catch (error) {
        setAuthenticated(false);
        localStorage.setItem('isAuthenticated', JSON.stringify(false));
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