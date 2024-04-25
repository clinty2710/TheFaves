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

app.use('/auth', authMiddleware.router);
app.use('/favorites', authMiddleware.ensureAuthenticated, favoriteRoutes);

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'public', 'login_form.html'));
});

// Serve static files before custom JS middleware to ensure correct order
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

// Custom middleware to set Content-Type for JavaScript files after serving static files
app.use((req, res, next) => {
  if (req.path.endsWith('.js')) {
    res.setHeader('Content-Type', 'application/javascript');
  }
  next();
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
