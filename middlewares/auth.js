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
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const newUser = await User.create({ email, password: hashedPassword, nickname });
    res.json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

router.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'public', 'registration_form.html'));
});

router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'public', 'login_form.html'));
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.redirect('/profile-page');  // Changed redirection to a neutral client-side route
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

module.exports = { ensureAuthenticated, router };