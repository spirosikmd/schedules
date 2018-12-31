const User = require('../models/user');

function deleteUser(userId) {
  return new Promise((resolve, reject) => {
    User.findById(userId, (err, user) => {
      if (err) {
        return reject(err);
      }

      if (user === null) {
        return reject('Cannot delete user');
      }

      user.remove().then(() => {
        resolve({ message: 'User successfully deleted' });
      });
    });
  });
}

module.exports = {
  deleteUser,
};
