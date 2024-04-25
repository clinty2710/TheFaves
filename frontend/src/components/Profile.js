// src/components/Profile.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LogoutButton from './LogoutButton';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('/auth/profile');
        setUser(response.data);
      } catch (error) {
        console.error('Profile fetch error:', error);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    user && (
      <div>
        <h2>Welcome, {user.nickname}!</h2>
        <p>Email: {user.email}</p>
        <LogoutButton />
      </div>
    )
  );
};

export default Profile;
