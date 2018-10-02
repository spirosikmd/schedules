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
  const { buffer, originalname } = req.file;
  const userId = req.user.id;

  const parser = new DefaultParser();
  const scheduleData = parseScheduleFileData({ parser, data: buffer });

  schedulesService
    .saveScheduleData(userId, originalname, scheduleData)
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
};
