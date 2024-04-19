// middlewares/auth.js

const express = require('express');
const router = express.Router();
const passport = require('passport'); // Import passport for authentication
const User = require('../models/user');
const bcrypt = require('bcrypt');
const path = require('path');

// Middleware function for ensuring authentication
const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: 'Unauthorized' });
};

// Registration route - Handle POST request for user registration
router.post('/register', async (req, res, next) => {
    try {
        const { email, password, nickname } = req.body;
        if (!email || !password || !nickname) {
            return res.status(400).json({ message: 'Nickname, email, and password are required' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ email, password: hashedPassword, nickname });
        res.json({ message: 'User registered successfully', user });
    } catch (error) {
        next(error);
    }
});

// Registration route - Handle GET request to render registration form
router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'public', 'registration_form.html'));
});

// Login route - Handle GET request to render login form
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'public', 'login_form.html'));
});

// Login route - Handle POST request for user login
router.post('/login', passport.authenticate('local'), (req, res) => {
  res.redirect('/auth/profile');
});

// Profile route - Handle GET request to render user profile
router.get('/profile', ensureAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'public', 'profile.html')); // Render the profile.html file
});

// Profile route - Handle GET request to fetch user profile data
router.post('/profile', ensureAuthenticated, async (req, res) => {
  try {
    // Fetch user profile data from the database
    const user = await User.findByPk(req.user.id); // Assuming you have access to the authenticated user object

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Construct the user profile data object
    const userProfileData = {
      id: user.id,
      nickname: user.nickname,
      email: user.email,
      // Add any additional fields you want to include in the profile data
    };

    // Send the user profile data as JSON response
    res.json(userProfileData);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Logout route - Handle GET request for user logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/auth/login');
});

module.exports = { ensureAuthenticated, router };
