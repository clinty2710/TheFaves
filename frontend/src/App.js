// src/App.js
// Clint Steadman

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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

  return (
    <UserProvider>
      <div className="App">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Navigate replace to={isAuthenticated ? "/profile" : "/login"} />} />
            <Route path="/login" element={isAuthenticated ? <Navigate replace to="/profile" /> : <Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate replace to="/login" />} />
            <Route path="/favorite-items" element={isAuthenticated ? <FavoriteItems /> : <Navigate replace to="/login" />} />
          </Routes>
        </ErrorBoundary>

        {/* ToastContainer with custom styles */}
        <ToastContainer 
          autoClose={3000} 
          toastStyle={{
            backgroundColor: '#1a374d',
            color: '#ffffff',
            borderRadius: '8px',
            border: '1px solid #ff6347',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
            width: 250,
          }}
        />
      </div>
    </UserProvider>
  );
}

export default App;
