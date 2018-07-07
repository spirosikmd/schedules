const Settings = require('../models/settings');
const User = require('../models/user');

function getSettings(userEmail) {
  return new Promise((resolve, reject) => {
    User.findOne({ email: userEmail }, (err, user) => {
      if (err) {
        return reject(err);
      }

      if (user === null) {
        return reject(`Cannot get settings for user with email ${userEmail}`);
      }

      Settings.findOne({ user: user._id }, (err, settings) => {
        if (err) {
          return reject(err);
        }

        resolve(settings);
      });
    });
  });
}

function updateSettings(userEmail, hourlyWage, person) {
  return new Promise((resolve, reject) => {
    User.findOne({ email: userEmail }, (err, user) => {
      if (err) {
        return reject(err);
      }

      if (user === null) {
        return reject(
          `Cannot update settings for user with email ${userEmail}`
        );
      }

      const data = { hourlyWage, person, user: user._id };

      Settings.create(data, (err, settings) => {
        if (err) {
          return reject(err);
        }

        resolve(settings);
      });
    });
  });
}

module.exports = {
  getSettings,
  updateSettings,
};
