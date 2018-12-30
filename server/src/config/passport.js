const passport = require('passport');
const User = require('../models/user');
const GoogleStrategy = require('passport-google-token').Strategy;

module.exports = function() {
  return new Promise(resolve => {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
          clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
        },
        function(accessToken, refreshToken, profile, done) {
          User.upsertGoogleUser(accessToken, refreshToken, profile, function(
            err,
            user
          ) {
            return done(err, user);
          });
        }
      )
    );

    resolve();
  });
};
