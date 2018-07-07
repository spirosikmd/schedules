const User = require('../models/user');

function createUser(email) {
  return new Promise((resolve, reject) => {
    User.find({ email }, (err, user) => {
      if (err) {
        return reject(err);
      }

      if (user === null) {
        User.create({ email }, (err, user) => {
          if (err) {
            return reject(err);
          }

          resolve(user);
        });
        return;
      }

      resolve(user);
    });
  });
}

module.exports = { createUser };
