// server.js

const express = require('express');
const session = require('express-session');
const passport = require('./config/passport');
const path = require('path');
const crypto = require('crypto');
const db = require('./models');  // Import the models
const favoriteRoutes = require('./routes/Favorites');
const cors = require('cors');
const authMiddleware = require('./middlewares/auth'); // Add this line

const app = express();
const isDevelopment = process.env.NODE_ENV !== 'production';

require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const randomSessionSecret = crypto.randomBytes(32).toString('hex');
app.use(session({
  secret: randomSessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: !isDevelopment }
}));
app.use(passport.initialize());
app.use(passport.session());

db.sequelize.authenticate().then(() => {
  console.log('Connected to the database');
  return db.sequelize.sync();
}).catch((err) => {
  console.error('Unable to synchronize models with the database:', err);
});

app.use('/auth', authMiddleware.router); // Now this line should work
app.use('/api/favorites', favoriteRoutes);

app.use(express.static(path.join(__dirname, 'frontend', 'dist')));
app.get('/profile', (req, res) => {
  if (req.isAuthenticated()) {
    res.sendFile(path.join(__dirname, 'frontend', 'public', 'profile.html'));
  } else {
    res.status(401).send('Unauthorized');
  }
});
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
