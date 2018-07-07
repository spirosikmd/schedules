const multer = require('multer');
const {
  saveScheduleData,
  getScheduleDataForPerson,
  getSchedules,
  getSelectedScheduleId,
  getSettings,
  updateSchedule,
} = require('../db');
const { parseScheduleFileData } = require('../parser');

const upload = multer();

module.exports = function(app) {
  app.get('/api/schedules', (req, res) => {
    getSchedules()
      .then(data => res.json(data))
      .catch(error => {
        res.status(404).json({
          message: error,
        });
      });
  });

  app.post('/api/schedules', upload.single('scheduleFile'), (req, res) => {
    const { buffer, originalname } = req.file;

    const scheduleData = parseScheduleFileData(buffer);

    saveScheduleData(originalname, scheduleData)
      .then(data => res.json(data))
      .catch(error =>
        res.status(404).json({
          message: error,
        })
      );
  });

  app.get('/api/selected-schedule-id', (req, res) => {
    getSelectedScheduleId()
      .then(data => res.json(data))
      .catch(error => {
        res.status(404).json({
          message: error,
        });
      });
  });

  app.put('/api/schedules/:scheduleId', (req, res) => {
    const { scheduleId } = req.params;
    const data = req.body;

    updateSchedule(scheduleId, data)
      .then(data => res.json(data))
      .catch(error =>
        res.status(404).json({
          message: error,
        })
      );
  });

  app.get('/api/schedules/:scheduleId/generate', (req, res) => {
    const { scheduleId } = req.params;
    const { person, hourlyWage } = req.query;

    getScheduleDataForPerson(scheduleId, person.toLowerCase(), hourlyWage)
      .then(data => res.json(data))
      .catch(error => {
        res.status(404).json({
          message: error,
        });
      });
  });

  app.get('/api/settings', (req, res) => {
    getSettings()
      .then(data => res.json(data))
      .catch(error => {
        res.status(404).json({
          message: error,
        });
      });
  });
};
