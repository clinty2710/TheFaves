// /src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Profile from './components/Profile';
import Register from './components/Register';
import Login from './components/Login';
import FavoriteItems from './components/FavoriteItems';
import { useAuth } from './AuthContext'; // Correct import of useAuth

function App() {
  const auth = useAuth();
  
  if (!auth || auth.isAuthenticated === undefined) {
    console.error('Authentication context is not set up correctly.');
    return <div>Error: Authentication context is missing or broken.</div>;
  }

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Welcome to Your Favorites App</h1>
        </header>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile-page" element={auth.isAuthenticated ? <Profile /> : <Navigate replace to="/" />} />
          <Route path="/favorite-items" element={auth.isAuthenticated ? <FavoriteItems /> : <Navigate replace to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;