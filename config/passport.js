// config/passport.js

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; // Import LocalStrategy for local authentication
const User = require('../models/user'); // Adjust the path if necessary
const bcrypt = require('bcrypt');

// Configure Local strategy for authentication
passport.use(new LocalStrategy({
    usernameField: 'email', // Specify the field for username (email)
    passwordField: 'password', // Specify the field for password
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ where: { email } });
        if (!user || !(await user.isValidPassword(password))) {
            return done(null, false, { message: 'Invalid email or password' });
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
