//server.js

const express = require('express');
const session = require('express-session');
const passport = require('./config/passport');
const path = require('path');
const crypto = require('crypto');
const { Sequelize } = require('sequelize');
const User = require('./models/user');
const authMiddleware = require('./middlewares/auth');
const favoriteRoutes = require('./routes/Favorites');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Allow requests from all origins
app.use(cors());

const randomSessionSecret = crypto.randomBytes(32).toString('hex');
app.use(bodyParser.urlencoded({ extended: false })); // Parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // Parse application/json
app.use(express.json()); // Apply express.json() middleware here
app.use(session({ secret: randomSessionSecret, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

const sequelize = new Sequelize('thefavesdb', 'root', 'Studman081!', {
  host: 'localhost',
  dialect: 'mysql',
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connected to the database');
    return sequelize.sync();
  })
  .then(() => {
    console.log('All models were synchronized successfully.');
  })
  .catch((err) => {
    console.error('Unable to synchronize models with the database:', err);
  });

// API and specific route configurations
app.post('/auth/register', async (req, res) => {
  const { email, password, nickname } = req.body;
  try {
    const newUser = await User.create({ email, password, nickname });
    res.send('User registered successfully!');
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('An error occurred while registering user.');
  }
});

// Mount middleware and routes
app.use('/auth', authMiddleware.router);
app.use('/favorites', authMiddleware.ensureAuthenticated, favoriteRoutes);

// Explicitly set MIME type for JS files before serving static files
app.use((req, res, next) => {
  if (req.path.endsWith('.js')) {
    res.type('application/javascript'); // Force MIME type to JavaScript
  }
  next();
});

// Serve static files from the frontend's build directory
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

// Fallback route for serving the React application
app.get('*', (req, res) => {
  if (!req.path.endsWith('.js')) {  // Ensure this check to avoid serving HTML for JS requests
    res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack for debugging
  res.status(500).send('Something broke!'); // Send a 500 error response
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
