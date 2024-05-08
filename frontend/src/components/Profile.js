// src/components/Profile.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LogoutButton from './LogoutButton';
import { useAuth } from '../AuthContext';

const Profile = React.memo(() => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            const fetchUserProfile = async () => {
                console.log("Fetching user profile...");
                try {
                    setLoading(true);
                    const response = await axios.get('/auth/profile');
                    console.log("Profile data received:", response.data);
                    if (response.data) {
                        setUser(response.data);
                        setError(null);
                    } else {
                        throw new Error('Failed to fetch profile data');
                    }
                } catch (error) {
                    console.error('Profile fetch error:', error);
                    setError(error.message);
                } finally {
                    setLoading(false);
                }
            };

            fetchUserProfile();
        }
    }, [isAuthenticated]); // Dependency array includes isAuthenticated to re-run effect when it changes

    if (loading) {
        console.log("Loading Profile...");
        return <div>Loading...</div>;
    }
    
    if (error) {
        console.log("Error loading profile:", error);
        return <div>Error: {error}</div>;
    }
    
    if (!user) {
        console.log("No user data received");
        return <div>No user data available</div>;
    }

    console.log("Profile Data:", user);
    return (
        <div>
            <h2>Welcome, {user.nickname}!</h2>
            <p>Email: {user.email}</p>
            <LogoutButton />
        </div>
    );
});

export default Profile;
