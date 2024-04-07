// middlewares/auth.js

const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');
const path = require('path');
const bcrypt = require('bcrypt');

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
        console.log(req.body); // Log the request body
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
        console.log('Hashed password:', hashedPassword); // Log the hashed password
        const user = await User.create({ email, password: hashedPassword }); // Store hashed password
        res.json({ message: 'User registered successfully', user });
    } catch (error) {
        next(error);
    }
});

// Registration route - Handle GET request to render registration form
router.get('/register', (req, res) => {
    // Serve the registration form HTML file
    res.sendFile(path.join(__dirname, '..', 'frontend', 'public', 'registration_form.html'));
});

// Auth0 login route
router.get('/login', passport.authenticate('auth0', {
  scope: 'openid email profile'
}));

// Auth0 callback route
router.get('/callback', passport.authenticate('auth0', {
  failureRedirect: '/login' // Redirect to /login if authentication fails
}), (req, res) => {
  res.redirect(req.session.returnTo || '/'); // Redirect to the original URL or home
});

// Auth0 logout route
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// Route to serve the user's profile page
router.get('/profile', ensureAuthenticated, (req, res) => {
  res.send(`Welcome, ${req.user.nickname}!`);
});

// Route to display user's favorites page
router.get('/favorites', ensureAuthenticated, (req, res) => {
    // Retrieve user's favorites from the database and render the favorites page
    res.send('User favorites page');
});

module.exports = { ensureAuthenticated, router };
