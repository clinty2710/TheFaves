// src/components/Profile.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LogoutButton from './LogoutButton';

// Wrap the component with React.memo to prevent unnecessary re-renders
const Profile = React.memo(() => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("Attempting to fetch user profile...");
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get('/auth/profile');
                console.log("Profile data received:", response.data);
                setUser(response.data); // Set user data from response
                setLoading(false); // Turn off loading state after data is received
            } catch (error) {
                console.error('Profile fetch error:', error);
                setError('Failed to load user profile.'); // Set error message
                setLoading(false); // Ensure loading state is turned off even in case of error
            }
        };

        fetchUserProfile();
    }, []); // Empty dependency array ensures this effect runs only once after the initial render

    if (loading) {
        console.log("Rendering Loading state...");
        return <div>Loading...</div>;
    }

    if (error) {
        console.log("Rendering Error state:", error);
        return <div>Error: {error}</div>;
    }

    if (!user) {
        console.log("No user data available.");
        return <div>No user data available</div>;
    }

    console.log("Rendering Profile content with user data...");
    return (
        <div>
            <h2>Welcome, {user.nickname}!</h2>
            <p>Email: {user.email}</p>
            <LogoutButton />
        </div>
    );
});

export default Profile;
