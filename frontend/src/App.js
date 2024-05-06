// src/App.js

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Profile from './components/Profile';
import Register from './components/Register';
import Login from './components/Login';
import FavoriteItems from './components/FavoriteItems';
import { useAuth } from './AuthContext';
import ErrorBoundary from './components/ErrorBoundary'; // Make sure the path is correct

function App() {
  const auth = useAuth();

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to Your Favorites App</h1>
      </header>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile-page" element={auth.isAuthenticated ? <Profile /> : <Navigate replace to="/" />} />
          <Route path="/favorite-items" element={auth.isAuthenticated ? <FavoriteItems /> : <Navigate replace to="/" />} />
        </Routes>
      </ErrorBoundary>
    </div>
  );
}

export default App;
