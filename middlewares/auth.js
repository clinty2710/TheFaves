// middlewares/auth.js

const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const path = require('path');

const router = express.Router();

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
};

router.post('/register', async (req, res) => {
  const { email, password, nickname } = req.body;
  if (!email || !password || !nickname) {
    return res.status(400).json({ message: 'All fields required' });
  }
  try {
    const newUser = new User({ email, password, nickname });
    await newUser.save();
    res.json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

// Serve registration form (if you have one)
router.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'public', 'registration_form.html'));
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    if (!user) {
      return res.status(401).json({ message: info.message });
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      return res.json({ success: true, message: 'Authentication successful', user: user });
    });
  })(req, res, next);
});

router.get('/profile', ensureAuthenticated, async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(404).json({ message: 'User not found' });
  }
  try {
    const user = await User.findById(req.user.id); // Updated to findById
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ id: user.id, nickname: user.nickname, email: user.email });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ message: 'Logout failed', error: err.message });
    }
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destruction error:', err);
        return res.status(500).json({ message: 'Failed to destroy the session.', error: err.message });
      }
      res.clearCookie('connect.sid');
      return res.status(200).json({ message: 'Logout successful' });
    });
  });
});

router.get('/check-session', (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({ isAuthenticated: true });
  } else {
    return res.json({ isAuthenticated: false });
  }
});

module.exports = { ensureAuthenticated, router };
