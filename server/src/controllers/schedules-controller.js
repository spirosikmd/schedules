const { parseScheduleFileData } = require('../parser');
const scheduleService = require('../services/schedule-service');

function generateSchedule(req, res) {
  const { scheduleId } = req.params;
  const { person, hourlyWage } = req.query;
  const userId = req.user.id;

  scheduleService
    .getScheduleDataForPerson(
      userId,
      scheduleId,
      person.toLowerCase(),
      hourlyWage
    )
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

  scheduleService
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

  scheduleService
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

  scheduleService
    .getSchedules(userId)
    .then(data => res.json(data))
    .catch(error => {
      res.status(404).json({
        message: error,
      });
    });
}

function createSchedule(req, res) {
  const { buffer, originalname } = req.file;
  const userId = req.user.id;

  const scheduleData = parseScheduleFileData(buffer);

  scheduleService
    .saveScheduleData(userId, originalname, scheduleData)
    .then(data => res.json(data))
    .catch(error =>
      res.status(404).json({
        message: error,
      })
    );
}

module.exports = {
  generateSchedule,
  deleteSchedule,
  updateSchedule,
  createSchedule,
  getSchedules,
};
