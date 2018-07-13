const multer = require('multer');
const passport = require('passport');
const {
  saveScheduleData,
  getScheduleDataForPerson,
  getSchedules,
  updateSchedule,
  deleteSchedule,
} = require('../services/schedule');
const { getSettings, updateSettings } = require('../services/settings');
const { createUser } = require('../services/user');
const {
  calculateHolyTotal,
  calculateWeeklyWageData,
} = require('../services/aggregations');
const { parseScheduleFileData } = require('../parser');
const { generateToken, sendToken } = require('../utils/token');

const upload = multer();

module.exports = function(app) {
  app.get('/api/schedules', (req, res) => {
    const { userEmail } = req.query;

    getSchedules(userEmail)
      .then(data => res.json(data))
      .catch(error => {
        res.status(404).json({
          message: error,
        });
      });
  });

  app.post('/api/schedules', upload.single('scheduleFile'), (req, res) => {
    const { buffer, originalname } = req.file;
    const { userEmail } = req.query;

    const scheduleData = parseScheduleFileData(buffer);

    saveScheduleData(userEmail, originalname, scheduleData)
      .then(data => res.json(data))
      .catch(error =>
        res.status(404).json({
          message: error,
        })
      );
  });

  app.put('/api/schedules/:scheduleId', (req, res) => {
    const { scheduleId } = req.params;
    const { userEmail } = req.query;
    const data = req.body;

    updateSchedule(userEmail, scheduleId, data)
      .then(data => res.json(data))
      .catch(error =>
        res.status(404).json({
          message: error,
        })
      );
  });

  app.delete('/api/schedules/:scheduleId', (req, res) => {
    const { scheduleId } = req.params;
    const { userEmail } = req.query;

    deleteSchedule(userEmail, scheduleId)
      .then(data => res.json(data))
      .catch(error =>
        res.status(404).json({
          message: error,
        })
      );
  });

  app.get('/api/schedules/:scheduleId/generate', (req, res) => {
    const { scheduleId } = req.params;
    const { person, hourlyWage, userEmail } = req.query;

    getScheduleDataForPerson(
      userEmail,
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
  });

  app.get('/api/settings', (req, res) => {
    const { userEmail } = req.query;

    getSettings(userEmail)
      .then(data => res.json(data))
      .catch(error => {
        res.status(404).json({
          message: error,
        });
      });
  });

  app.put('/api/settings/:settingsId', (req, res) => {
    const { hourlyWage, person } = req.body;
    const { userEmail } = req.query;
    const { settingsId } = req.params;

    updateSettings(userEmail, settingsId, hourlyWage, person)
      .then(data => res.json(data))
      .catch(error => {
        res.status(404).json({
          message: error,
        });
      });
  });

  app.post('/api/users', (req, res) => {
    const { email } = req.body;

    createUser(email)
      .then(data => res.json(data))
      .catch(error => {
        res.status(404).json({
          message: error,
        });
      });
  });

  app.get('/api/aggregations/holy-total', (req, res) => {
    const { person, hourlyWage, userEmail } = req.query;

    calculateHolyTotal(userEmail, person, hourlyWage)
      .then(data => res.json(data))
      .catch(error => {
        res.status(404).json({
          message: error,
        });
      });
  });

  app.get('/api/aggregations/weekly-wage-data', (req, res) => {
    const { person, hourlyWage, userEmail } = req.query;

    calculateWeeklyWageData(userEmail, person, hourlyWage)
      .then(data => res.json(data))
      .catch(error => {
        res.status(404).json({
          message: error,
        });
      });
  });

  app.get(
    '/api/auth/google',
    passport.authenticate('google-token', { session: false }),
    function(req, res, next) {
      if (!req.user) {
        return res.status(401).json({ message: 'User Not Authenticated' });
      }

      req.auth = {
        id: req.user.id,
      };

      next();
    },
    generateToken,
    sendToken
  );
};
