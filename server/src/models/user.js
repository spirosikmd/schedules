const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  },
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  googleProvider: {
    type: {
      id: String,
      token: String,
    },
    select: false,
  },
});

userSchema.statics.upsertGoogleUser = function(
  accessToken,
  refreshToken,
  profile,
  cb
) {
  const User = this;

  return User.findOne(
    {
      'googleProvider.id': profile.id,
    },
    function(err, user) {
      if (user) {
        return cb(err, user);
      }

      const newUser = new User({
        email: profile.emails[0].value,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        googleProvider: {
          id: profile.id,
          token: accessToken,
        },
      });

      newUser.save(function(error, savedUser) {
        if (error) {
          console.log(error);
        }
        return cb(error, savedUser);
      });
    }
  );
};

module.exports = mongoose.model('User', userSchema);
