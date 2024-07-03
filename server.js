// server.js

require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('./config/passport');
const path = require('path');
const mongoose = require('mongoose');
const authMiddleware = require('./middlewares/auth');
const favoriteRoutes = require('./routes/Favorites');
const cors = require('cors');
const MongoStore = require('connect-mongo');

const app = express();
const isDevelopment = process.env.NODE_ENV !== 'production';

// Trust the first proxy
app.set('trust proxy', 1); // Trust first proxy

// Set up body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
const corsOptions = {
  origin: ['https://myfavessite.com', 'http://localhost:3000'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  allowedHeaders: 'Content-Type, Authorization'
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  dbName: 'thefaves',
}).then(() => {
  console.log('MongoDB connected.');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Set up session and passport with MongoStore
const sessionSecret = process.env.SESSION_SECRET;
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  cookie: {
    secure: true, // Ensure it's true for HTTPS
    sameSite: 'None', // Set SameSite to 'None' for cross-origin requests
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authMiddleware.router);
app.use('/api/favorites', favoriteRoutes);

// Static files
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

app.get('/profile', (req, res) => {
  if (req.isAuthenticated()) {
    res.sendFile(path.join(__dirname, 'frontend', 'dist', 'profile.html'));
  } else {
    res.status(401).send('Unauthorized');
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
