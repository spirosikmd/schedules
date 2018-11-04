const { validationResult } = require('express-validator/check');
const DefaultParser = require('../parser');
const parseScheduleFileData = require('../services/parser-service');
const schedulesService = require('../services/schedules-service');

function getSchedule(req, res) {
  const { scheduleId } = req.params;
  const { person } = req.query;
  const userId = req.user.id;

  schedulesService
    .getScheduleDataForPerson(userId, scheduleId, person.toLowerCase())
    .then(data => res.json(data))
    .catch(error => {
      res.status(404).json({
        message: error,
      });
    });
}

function deleteSchedule(req, res) {
  const { scheduleId } = req.params;
  const userId = req.user.id;

  schedulesService
    .deleteSchedule(userId, scheduleId)
    .then(data => res.json(data))
    .catch(error =>
      res.status(404).json({
        message: error,
      })
    );
}

function updateSchedule(req, res) {
  const { scheduleId } = req.params;
  const userId = req.user.id;
  const data = req.body;

  schedulesService
    .updateSchedule(userId, scheduleId, data)
    .then(data => res.json(data))
    .catch(error =>
      res.status(404).json({
        message: error,
      })
    );
}

function getSchedules(req, res) {
  const userId = req.user.id;

  schedulesService
    .getSchedules(userId)
    .then(data => res.json(data))
    .catch(error => {
      res.status(404).json({
        message: error,
      });
    });
}

function generateSchedule(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { buffer, originalname } = req.file;
  const { timezone, hourlyWage } = req.body;
  const userId = req.user.id;

  const parser = new DefaultParser();
  const scheduleData = parseScheduleFileData({
    parser,
    data: buffer,
    timezone,
  });

  schedulesService
    .saveScheduleData(userId, originalname, scheduleData, hourlyWage)
    .then(data => res.json(data))
    .catch(error =>
      res.status(404).json({
        message: error,
      })
    );
}

function createSchedule(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const data = req.body;
  const userId = req.user.id;

  schedulesService
    .createSchedule(userId, data)
    .then(data => res.json(data))
    .catch(error =>
      res.status(404).json({
        message: error,
      })
    );
}

module.exports = {
  getSchedule,
  deleteSchedule,
  updateSchedule,
  generateSchedule,
  getSchedules,
  createSchedule,
};
