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
    // Synchronize models with the database
    return sequelize.sync(); // Remove { force: true }
  })
  .then(() => {
    console.log('All models were synchronized successfully.');
  })
  .catch((err) => {
    console.error('Unable to synchronize models with the database:', err);
  });

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'frontend', 'public')));

// Define the registration route
app.post('/auth/register', async (req, res) => {
  const { email, password, nickname } = req.body; // Include nickname in registration

  try {
    // Create a new user record in the MySQL database
    const newUser = await User.create({ email, password, nickname }); // Include nickname
    res.send('User registered successfully!');
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('An error occurred while registering user.');
  }
});

// Define routes
app.use('/auth', authMiddleware.router); // Mount auth routes
app.use('/favorites', authMiddleware.ensureAuthenticated, favoriteRoutes); // Mount favoriteRoutes with authentication middleware

// Route to serve the login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'public', 'login_form.html')); // Adjust the path to your login HTML file
});

// Route to serve the React application
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
