const settingsService = require('../services/settings-service');

function updateSettings(req, res) {
  const { hourlyWage, person } = req.body;
  const userId = req.user.id;
  const { settingsId } = req.params;

  settingsService
    .updateSettings(userId, settingsId, hourlyWage, person)
    .then(data => res.json(data))
    .catch(error => {
      res.status(404).json({
        message: error,
      });
    });
}

function getSettings(req, res) {
  const userId = req.user.id;

  settingsService
    .getSettings(userId)
    .then(data => res.json(data))
    .catch(error => {
      res.status(404).json({
        message: error,
      });
    });
}

module.exports = { getSettings, updateSettings };
