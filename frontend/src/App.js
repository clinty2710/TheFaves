// src/App.js

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Profile from './components/Profile';
import Register from './components/Register';
import Login from './components/Login';
import FavoriteItems from './components/FavoriteItems';
import { useAuth } from './AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import { UserProvider } from './components/UserContext';

function App() {
  const auth = useAuth();
  console.log(auth.isAuthenticated);

  return (
    <UserProvider>
      <div className="App">
        <header className="App-header">
          <h1>The Faves</h1>
        </header>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Navigate replace to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={auth.isAuthenticated ? <Profile /> : <Navigate replace to="/login" />} />
            <Route path="/favorite-items" element={auth.isAuthenticated ? <FavoriteItems /> : <Navigate replace to="/login" />} />
          </Routes>
        </ErrorBoundary>
      </div>
    </UserProvider>
  );
}

export default App;
