// src/App.js

// src/App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Profile from './components/Profile';
import Register from './components/Register';
import Login from './components/Login';
import FavoriteItems from './components/FavoriteItems';
import { AuthProvider } from './AuthContext';
import { UserProvider } from './components/UserContext';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles.css';

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <div className="App">
          <header className="App-header">
            <h1>
              <span className="title-the">my</span><span className="title-faves">FAVES</span>
            </h1>
          </header>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Navigate replace to="/profile" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/favorite-items" element={<FavoriteItems />} />
            </Routes>
          </ErrorBoundary>
          <ToastContainer autoClose={3000} />
        </div>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
