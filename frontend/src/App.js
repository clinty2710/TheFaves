// App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Profile from './components/Profile';
import Register from './components/Register';
import Login from './components/Login'; // Import Login component
import Favorites from '../../routes/Favorites'; // Update import path to reflect the correct file structure

function App() {
    // Mock isAuthenticated state
    const isAuthenticated = true; // Replace with your authentication logic

    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <h1>Welcome to Your Favorites App</h1>
                </header>
                <Routes>
                    <Route path="/register" element={<Register />} />
                    {isAuthenticated ? (
                        <>
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/favorites" element={<Favorites />} />
                        </>
                    ) : (
                        <Route path="/" element={<Login />} />
                    )}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
