const aggregationsService = require('../services/aggregations-service');

function getWeeklyWageData(req, res) {
  const { person, hourlyWage } = req.query;
  const userId = req.user.id;

  aggregationsService
    .calculateWeeklyWageData(userId, person, hourlyWage)
    .then(data => res.json(data))
    .catch(error => {
      res.status(404).json({
        message: error,
      });
    });
}

function getHolyTotal(req, res) {
  const { person, hourlyWage } = req.query;
  const userId = req.user.id;

  aggregationsService
    .calculateHolyTotal(userId, person, hourlyWage)
    .then(data => res.json(data))
    .catch(error => {
      res.status(404).json({
        message: error,
      });
    });
}

module.exports = { getWeeklyWageData, getHolyTotal };
