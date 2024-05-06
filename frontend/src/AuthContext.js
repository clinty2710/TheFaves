// AuthContext.js
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext({ isAuthenticated: false, setAuthenticated: () => {} });

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setAuthenticated] = useState(false);
  return (
    <AuthContext.Provider value={{ isAuthenticated, setAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
