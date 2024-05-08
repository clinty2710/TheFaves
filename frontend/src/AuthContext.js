// AuthContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setAuthenticated] = useState(false);

  // Check session storage or perform a check to backend to validate session
  useEffect(() => {
    const verifySession = async () => {
      // Dummy function to simulate session check
      const sessionIsValid = sessionStorage.getItem('isAuthenticated');
      setAuthenticated(sessionIsValid);
    };

    verifySession();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
