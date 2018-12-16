const DefaultParser = require('../parser');
const parseScheduleFileData = require('../services/parser-service');
const schedulesService = require('../services/schedules-service');

function getSchedule(req, res) {
  const { scheduleId } = req.params;
  const userId = req.user.id;

  schedulesService
    .getSchedule(userId, scheduleId)
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
  const { buffer, originalname } = req.file;
  const { timezone, hourlyWage, person } = req.body;
  const userId = req.user.id;

  const parser = new DefaultParser();
  const scheduleEntryData = parseScheduleFileData({
    parser,
    data: buffer,
    timezone,
    person,
  });

  schedulesService
    .generateSchedule(userId, originalname, scheduleEntryData, hourlyWage)
    .then(data => res.json(data))
    .catch(error =>
      res.status(404).json({
        message: error,
      })
    );
}

function createSchedule(req, res) {
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

function createEntriesForSchedule(req, res) {
  const { entries } = req.body;
  const userId = req.user.id;
  const { scheduleId } = req.params;

  schedulesService
    .createEntriesForSchedule(userId, scheduleId, entries)
    .then(data => res.json(data))
    .catch(error =>
      res.status(404).json({
        message: error,
      })
    );
}

function updateEntryForSchedule(req, res) {
  const data = req.body;
  const userId = req.user.id;
  const { scheduleId, entryId } = req.params;

  schedulesService
    .updateEntryForSchedule(userId, scheduleId, entryId, data)
    .then(data => res.json(data))
    .catch(error =>
      res.status(404).json({
        message: error,
      })
    );
}

function deleteEntryForSchedule(req, res) {
  const userId = req.user.id;
  const { scheduleId, entryId } = req.params;

  schedulesService
    .deleteEntryForSchedule(userId, scheduleId, entryId)
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
  createEntriesForSchedule,
  updateEntryForSchedule,
  deleteEntryForSchedule,
};
