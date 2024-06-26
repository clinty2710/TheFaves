// server.js

require('dotenv').config(); 
const express = require('express');
const session = require('express-session');
const passport = require('./config/passport');
const path = require('path');
const crypto = require('crypto');
const { MongoClient, ServerApiVersion } = require('mongodb');
const authMiddleware = require('./middlewares/auth');
const favoriteRoutes = require('./routes/Favorites');
const cors = require('cors');

const app = express();
const isDevelopment = process.env.NODE_ENV !== 'production';

// Set up body parsing middleware
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

// MongoDB connection
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  }
}
run().catch(console.dir);

app.use('/auth', authMiddleware.router);
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
