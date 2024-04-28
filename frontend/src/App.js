// /src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Profile from './components/Profile';
import Register from './components/Register';
import Login from './components/Login';
import Favorites from '../../routes/Favorites';  // Correct import path assuming src is at the same level as routes

// Optional: Authentication context provider if you have authentication logic
import { AuthProvider, useAuth } from './AuthContext'; // Ensure this context set up is correct

function App() {
  const { isAuthenticated } = useAuth();  // Using authentication context properly

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Welcome to Your Favorites App</h1>
        </header>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile-page" element={isAuthenticated ? <Profile /> : <Navigate replace to="/" />} />
          <Route path="/favorites" element={isAuthenticated ? <Favorites /> : <Navigate replace to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
