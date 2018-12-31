const usersService = require('../services/users-service');

function deleteUser(req, res) {
  const userId = req.user.id;

  usersService
    .deleteUser(userId)
    .then(data => res.json(data))
    .catch(error => {
      res.status(404).json({
        message: error,
      });
    });
}

module.exports = {
  deleteUser,
};
