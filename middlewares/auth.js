// middlewares/auth.js

const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const bcrypt = require('bcrypt');
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
    const newUser = await User.create({ email, password, nickname });
    res.json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'src', 'components', 'Login.js'));
});

router.post('/login', (req, res, next) => {
  console.log(req.body);
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
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ id: user.id, nickname: user.nickname, email: user.email });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/auth/login');
});

router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).send('Something went wrong during logout.');
    }
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destruction error:', err);
        return res.status(500).send('Failed to destroy the session.');
      }
      res.clearCookie('connect.sid');
      res.redirect('/login');
    });
  });
});

module.exports = { ensureAuthenticated, router };
