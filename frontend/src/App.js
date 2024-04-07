// App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Update import to use BrowserRouter
import { useAuth0 } from '@auth0/auth0-react'; // Import useAuth0 hook
import Profile from './components/Profile';
import Register from './src/components/Register'; // Import Register component
import Favorites from '../../routes/Favorites'; // Update import path to reflect the correct file structure

function App() {
    const { isAuthenticated } = useAuth0(); // Check if user is authenticated

    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <h1>Welcome to Your Favorites App</h1>
                </header>
                <Routes>
                    <Route path="/register" element={<Register />} /> {/* Render Register component for /register route */}
                    {isAuthenticated ? ( // Render Profile and Favorites components if user is authenticated
                        <>
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/favorites" element={<Favorites />} />
                        </>
                    ) : (
                        <Route path="/" element={<Login />} /> // Render Login component if user is not authenticated
                    )}
                </Routes>
            </div>
        </Router>
    );
}

export default App;

