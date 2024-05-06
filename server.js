// server.js

const express = require('express');
const session = require('express-session');
const passport = require('./config/passport');
const path = require('path');
const crypto = require('crypto');
const { Sequelize } = require('sequelize');
const authMiddleware = require('./middlewares/auth');
const favoriteRoutes = require('./routes/Favorites');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
const randomSessionSecret = crypto.randomBytes(32).toString('hex');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(session({ secret: randomSessionSecret, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

const sequelize = new Sequelize('thefavesdb', 'root', 'Studman081!', {
  host: 'localhost',
  dialect: 'mysql',
});

sequelize.authenticate().then(() => {
  console.log('Connected to the database');
  return sequelize.sync();
}).catch((err) => {
  console.error('Unable to synchronize models with the database:', err);
});

app.use('/auth', authMiddleware.router);
app.use('/favorites', authMiddleware.ensureAuthenticated, favoriteRoutes);

app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

// Specific route for profile.html
app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'public', 'profile.html'));
});

// Fallback to index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
