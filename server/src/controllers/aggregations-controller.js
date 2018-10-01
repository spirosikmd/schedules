const aggregationsService = require('../services/aggregations-service');

function getWeeklyWageData(req, res) {
  const { person } = req.query;
  const userId = req.user.id;

  aggregationsService
    .calculateWeeklyWageData(userId, person)
    .then(data => res.json(data))
    .catch(error => {
      res.status(404).json({
        message: error,
      });
    });
}

function getHolyTotal(req, res) {
  const { person } = req.query;
  const userId = req.user.id;

  aggregationsService
    .calculateHolyTotal(userId, person)
    .then(data => res.json(data))
    .catch(error => {
      res.status(404).json({
        message: error,
      });
    });
}

module.exports = { getWeeklyWageData, getHolyTotal };
