const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../models');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Extract user data from Google profile
        const email = profile.emails[0].value;
        const firstName = profile.name.givenName;
        const lastName = profile.name.familyName;
        const avatar = profile.photos[0]?.value;
        const googleId = profile.id;

        // Check if user exists
        let user = await User.findOne({ where: { email } });

        if (user) {
          // User exists - update last login and Google ID if not set
          await user.update({
            lastLoginAt: new Date(),
            googleId: googleId,
            avatar: avatar || user.avatar,
            isEmailVerified: true // Google emails are verified
          });
        } else {
          // Create new user
          user = await User.create({
            firstName,
            lastName,
            email,
            password: Math.random().toString(36).slice(-8) + 'Aa1!', // Random password (won't be used)
            role: 'student', // Default role
            avatar,
            googleId,
            isEmailVerified: true, // Google emails are pre-verified
            isActive: true,
            status: 'active'
          });
        }

        return done(null, user);
      } catch (error) {
        console.error('Google OAuth error:', error);
        return done(error, null);
      }
    }
  )
);

module.exports = passport;