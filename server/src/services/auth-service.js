const User = require('../models/user');

function register(email, password, confirmPassword) {
  return new Promise((resolve, reject) => {
    if (password !== confirmPassword) {
      return reject('Passwords do not match');
    }

    const newUser = new User({ email, password });

    User.createUser(newUser, (error, user) => {
      if (error) {
        return reject('Registration failed');
      }

      resolve();
    });
  });
}

module.exports = { register };
