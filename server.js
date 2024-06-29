// server.js

require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('./config/passport');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const authMiddleware = require('./middlewares/auth');
const favoriteRoutes = require('./routes/Favorites');
const cors = require('cors');

const app = express();
const isDevelopment = process.env.NODE_ENV !== 'production';

// Set up body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
const corsOptions = {
  origin: ['https://www.myfavessite.com', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

// Apply CORS to all routes
app.use(cors(corsOptions));

// Ensure all preflight requests are answered with a successful status code
app.options('*', cors(corsOptions), (req, res) => {
  res.sendStatus(204);
});

// Set up session and passport
const randomSessionSecret = crypto.randomBytes(32).toString('hex');
app.use(session({
  secret: randomSessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: !isDevelopment }
}));
app.use(passport.initialize());
app.use(passport.session());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("MongoDB connected.");
}).catch(err => {
  console.error("Error connecting to MongoDB:", err);
});

// Routes
app.use('/auth', authMiddleware.router);
app.use('/api/favorites', favoriteRoutes);

// Static files
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));
app.get('/profile', (req, res) => {
  if (req.isAuthenticated()) {
    res.sendFile(path.join(__dirname, 'frontend', 'public', 'profile.html'));
  } else {
    res.status(401).send('Unauthorized');
  }
});
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'public', 'index.html'));
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
