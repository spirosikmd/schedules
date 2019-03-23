const aggregationsService = require('../services/aggregations-service');

function getWeeklyWageData(req, res) {
  const userId = req.user.id;

  aggregationsService
    .calculateWeeklyWageData(userId)
    .then(data => res.json(data))
    .catch(error => {
      res.status(404).json({
        message: error,
      });
    });
}

function getHolyTotal(req, res) {
  const userId = req.user.id;

  aggregationsService
    .calculateHolyTotal(userId)
    .then(data => res.json(data))
    .catch(error => {
      res.status(404).json({
        message: error,
      });
    });
}

function getWeeklyHourData(req, res) {
  const userId = req.user.id;

  aggregationsService
    .calculateWeeklyHourData(userId)
    .then(data => res.json(data))
    .catch(error => {
      res.status(404).json({
        message: error,
      });
    });
}

function getLocationHourData(req, res) {
  const userId = req.user.id;

  aggregationsService
    .calculateHoursPerLocation(userId)
    .then(data => res.json(data))
    .catch(error => {
      res.status(404).json({
        message: error,
      });
    });
}

function getNextWorkingDate(req, res) {
  const userId = req.user.id;

  aggregationsService
    .calculateNextWorkingDate(userId)
    .then(data => res.json(data))
    .catch(error => {
      res.status(404).json({
        message: error,
      });
    });
}

function getHighestLocation(req, res) {
  const userId = req.user.id;

  aggregationsService
    .calculateHighestLocation(userId)
    .then(data => res.json(data))
    .catch(error => {
      res.status(404).json({
        message: error,
      });
    });
}

function getBestSchedule(req, res) {
  const userId = req.user.id;

  aggregationsService
    .calculateBestSchedule(userId)
    .then(data => res.json(data))
    .catch(error => {
      res.status(404).json({
        message: error,
      });
    });
}

module.exports = {
  getWeeklyWageData,
  getHolyTotal,
  getWeeklyHourData,
  getLocationHourData,
  getNextWorkingDate,
  getBestSchedule,
  getHighestLocation,
};
