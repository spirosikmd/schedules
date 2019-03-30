const passport = require('passport');
const User = require('../models/user');
const GoogleStrategy = require('passport-google-token').Strategy;
const LocalStrategy = require('passport-local').Strategy;

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

    passport.use(
      new LocalStrategy({ usernameField: 'email' }, function(
        email,
        password,
        done
      ) {
        User.getUserByEmail(email, (error, user) => {
          if (error) throw error;

          if (!user) {
            return done(null, false);
          }

          User.comparePassword(password, user.password, function(
            error,
            isMatch
          ) {
            if (error) throw error;

            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false);
            }
          });
        });
      })
    );

    resolve();
  });
};
