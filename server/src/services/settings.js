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

        if (settings === null) {
          Settings.create(
            { user: user._id, hourlyWage: 8.55, person: '' },
            (err, newSettings) => {
              if (err) {
                return reject(err);
              }

              resolve(newSettings);
            }
          );
          return;
        }

        resolve(settings);
      });
    });
  });
}

function updateSettings(userEmail, settingsId, hourlyWage, person) {
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

      Settings.findOneAndUpdate(
        { _id: settingsId, user: user._id },
        data,
        { new: true },
        (err, settings) => {
          if (err) {
            return reject(err);
          }

          resolve(settings);
        }
      );
    });
  });
}

module.exports = {
  getSettings,
  updateSettings,
};
