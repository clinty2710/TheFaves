// server.js

require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('./config/passport');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const MongoStore = require('connect-mongo');
const { router: authRoutes } = require('./middlewares/auth');
const favoriteRoutes = require('./routes/Favorites');
const app = express();

app.set('trust proxy', 1); // Trust first proxy

// Set up body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
const corsOptions = {
  origin: ['https://myfavessite.com', 'https://thefaves-8616b810d2fc.herokuapp.com'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,  // Allow credentials
  allowedHeaders: 'Content-Type, Authorization'
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  dbName: 'thefaves', // Ensure the correct database name
}).then(() => {
  console.log('MongoDB connected.');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Set up session and passport with MongoStore
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  cookie: {
    secure: true, // Ensure this is true for HTTPS
    sameSite: 'none', // Ensure cross-site cookies are allowed
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Middleware to set MIME types for fonts
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.url.endsWith('.woff2')) {
    res.setHeader('Content-Type', 'application/font-woff2');
  } else if (req.url.endsWith('.woff')) {
    res.setHeader('Content-Type', 'application/font-woff');
  } else if (req.url.endsWith('.eot')) {
    res.setHeader('Content-Type', 'application/vnd.ms-fontobject');
  } else if (req.url.endsWith('.ttf')) {
    res.setHeader('Content-Type', 'font/ttf');
  } else if (req.url.endsWith('.otf')) {
    res.setHeader('Content-Type', 'font/otf');
  }
  next();
});

// Routes
app.use('/auth', authRoutes);
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
