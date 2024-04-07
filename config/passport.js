// config/passport.js

const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const User = require('../models/user'); // Adjust the path if necessary

// Configure Auth0 strategy
passport.use(new Auth0Strategy({
  domain: 'dev-e2ak2biooipxd1g7.us.auth0.com',
  clientID: 'rnrz5blPhdv8z6MjZ1Cv5rpvvI0jZ2FG',
  clientSecret: 'Gj15TbKDnLUptev3pDd47wAjXVI4JK_hqLJ323g_bQ8MLqkuU0AmLD7yPKIEqFc2',
  callbackURL: 'http://localhost:3000/auth/callback' // Update with your callback URL
}, async (accessToken, refreshToken, extraParams, profile, done) => {
  // Check if user exists in your database, or create a new user if necessary
  try {
    let user = await User.findOne({ where: { email: profile.emails[0].value } });
    if (!user) {
      user = await User.create({ email: profile.emails[0].value, nickname: profile.nickname });
    }
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id); // Serialize user ID into the session
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
