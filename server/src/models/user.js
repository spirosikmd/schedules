const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const Schedule = require('./schedule');
const ScheduleEntry = require('./schedule-entry');

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

userSchema.post('remove', doc => {
  Schedule.deleteMany({ user: doc._id }).exec();
  ScheduleEntry.deleteMany({ user: doc._id }).exec();
});

userSchema.plugin(timestamps);

module.exports = mongoose.model('User', userSchema);
