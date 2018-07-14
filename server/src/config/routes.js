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
const { generateToken, sendToken, verifyToken } = require('../utils/token');

const upload = multer();

module.exports = function(app) {
  app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../../../client/build/index.html'));
  });

  app.get('/api/schedules', verifyToken, (req, res) => {
    const userId = req.user.id;

    getSchedules(userId)
      .then(data => res.json(data))
      .catch(error => {
        res.status(404).json({
          message: error,
        });
      });
  });

  app.post(
    '/api/schedules',
    verifyToken,
    upload.single('scheduleFile'),
    (req, res) => {
      const { buffer, originalname } = req.file;
      const userId = req.user.id;

      const scheduleData = parseScheduleFileData(buffer);

      saveScheduleData(userId, originalname, scheduleData)
        .then(data => res.json(data))
        .catch(error =>
          res.status(404).json({
            message: error,
          })
        );
    }
  );

  app.put('/api/schedules/:scheduleId', verifyToken, (req, res) => {
    const { scheduleId } = req.params;
    const userId = req.user.id;
    const data = req.body;

    updateSchedule(userId, scheduleId, data)
      .then(data => res.json(data))
      .catch(error =>
        res.status(404).json({
          message: error,
        })
      );
  });

  app.delete('/api/schedules/:scheduleId', verifyToken, (req, res) => {
    const { scheduleId } = req.params;
    const userId = req.user.id;

    deleteSchedule(userId, scheduleId)
      .then(data => res.json(data))
      .catch(error =>
        res.status(404).json({
          message: error,
        })
      );
  });

  app.get('/api/schedules/:scheduleId/generate', verifyToken, (req, res) => {
    const { scheduleId } = req.params;
    const { person, hourlyWage } = req.query;
    const userId = req.user.id;

    getScheduleDataForPerson(
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
  });

  app.get('/api/settings', verifyToken, (req, res) => {
    const userId = req.user.id;

    getSettings(userId)
      .then(data => res.json(data))
      .catch(error => {
        res.status(404).json({
          message: error,
        });
      });
  });

  app.put('/api/settings/:settingsId', verifyToken, (req, res) => {
    const { hourlyWage, person } = req.body;
    const userId = req.user.id;
    const { settingsId } = req.params;

    updateSettings(userId, settingsId, hourlyWage, person)
      .then(data => res.json(data))
      .catch(error => {
        res.status(404).json({
          message: error,
        });
      });
  });

  app.post('/api/users', verifyToken, (req, res) => {
    const userId = req.user.id;

    createUser(userId)
      .then(data => res.json(data))
      .catch(error => {
        res.status(404).json({
          message: error,
        });
      });
  });

  app.get('/api/aggregations/holy-total', verifyToken, (req, res) => {
    const { person, hourlyWage } = req.query;
    const userId = req.user.id;

    calculateHolyTotal(userId, person, hourlyWage)
      .then(data => res.json(data))
      .catch(error => {
        res.status(404).json({
          message: error,
        });
      });
  });

  app.get('/api/aggregations/weekly-wage-data', verifyToken, (req, res) => {
    const { person, hourlyWage } = req.query;
    const userId = req.user.id;

    calculateWeeklyWageData(userId, person, hourlyWage)
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
        return res.status(401).json({ message: 'User not authenticated' });
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
