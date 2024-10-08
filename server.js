//server.js
// Clint Steadman

require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('./config/passport');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const MongoStore = require('connect-mongo');
const { connectDB } = require('./models');
const authRoutes = require('./middlewares/auth').router;
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
  credentials: true,
  allowedHeaders: 'Content-Type, Authorization'
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Middleware to set MIME types for fonts
app.use((req, res, next) => {
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

// Connect to MongoDB
connectDB().then(() => {
  // Set up session and passport with MongoStore
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: {
      secure: true,
      sameSite: 'None',
      maxAge: 24 * 60 * 60 * 1000
    }
  }));

  app.use(passport.initialize());
  app.use(passport.session());

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
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});
//