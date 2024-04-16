// Profile.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LogoutButton from './LogoutButton'; // Import the LogoutButton component

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Make a GET request to fetch user profile
        const response = await axios.get('/middlewares/auth/profile');
        setUser(response.data); // Update user state with the fetched user profile
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
        {/* Optionally, display additional user profile information */}
        {/* <p>First Name: {user.firstName}</p> */}
        {/* <p>Last Name: {user.lastName}</p> */}
        {/* <p>Age: {user.age}</p> */}
        {/* <img src={user.profilePicture} alt="Profile" /> */}
        <LogoutButton /> {/* Render the LogoutButton component */}
      </div>
    )
  );
};

export default Profile;
