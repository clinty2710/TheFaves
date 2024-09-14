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

        {/* Updated ToastContainer with custom styles */}
        <ToastContainer 
          autoClose={3000} 
          toastStyle={{
            backgroundColor: '#0a2540',  // Dark blue background
            color: '#ffffff',            // White text color
            borderRadius: '8px',         // Rounded corners
            border: '2px solid #ff6347', // Orange border
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', // Box shadow for elevation
          }}
        />
      </div>
    </UserProvider>
  );
}

export default App;
