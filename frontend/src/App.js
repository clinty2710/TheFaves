// src/App.js

import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Profile from './components/Profile';
import Register from './components/Register';
import Login from './components/Login';
import FavoriteItems from './components/FavoriteItems';
import { useAuth } from './AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import { UserProvider } from './components/UserContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './styles.css';

function App() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  const isLoginPage = location.pathname === '/login' || location.pathname === '/register';
  const isProfilePage = location.pathname === '/profile';

  return (
    <UserProvider>
      <div className="App">
        <header className="App-header">
          <div className={`logo ${isLoginPage ? 'login' : ''} ${isProfilePage ? 'profile' : ''}`}>
            <span className="my">my</span>
            <span className="f">F</span>
            <span className="a">A</span>
            <span className="heart-v"></span>
            <span className="e">E</span>
            <span className="s">S</span>
          </div>
        </header>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Navigate replace to={isAuthenticated ? "/profile" : "/login"} />} />
            <Route path="/login" element={isAuthenticated ? <Navigate replace to="/profile" /> : <Login />} />
            <Route path="/register" element={isAuthenticated ? <Navigate replace to="/profile" /> : <Register />} />
            <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate replace to="/login" />} />
            <Route path="/favorite-items" element={isAuthenticated ? <FavoriteItems /> : <Navigate replace to="/login" />} />
          </Routes>
        </ErrorBoundary>
        <ToastContainer autoClose={3000} />
      </div>
    </UserProvider>
  );
}

export default App;
