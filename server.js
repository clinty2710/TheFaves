// server.js

require('dotenv').config();  // Load environment variables from .env file
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
app.use(express.json());  // for parsing application/json
app.use(express.urlencoded({ extended: true }));  // for parsing application/x-www-form-urlencoded

app.use(cors());
const randomSessionSecret = crypto.randomBytes(32).toString('hex');
app.use(session({
  secret: randomSessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: !isDevelopment }  // Set secure to true if in production
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
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
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
