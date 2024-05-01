// src/components/Profile.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LogoutButton from './LogoutButton';

const Profile = React.memo(() => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
          try {
            setLoading(true);
            const response = await axios.get('/auth/profile');
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
      }, []);
      

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!user) {
        return <div>No user data available</div>;
    }

    return (
        <div>
            <h2>Welcome, {user.nickname}!</h2>
            <p>Email: {user.email}</p>
            <LogoutButton />
        </div>
    );
});

export default Profile;
