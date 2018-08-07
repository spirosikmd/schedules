const multer = require('multer');
const passport = require('passport');
const authController = require('../controllers/auth-controller');
const aggregationsController = require('../controllers/aggregations-controller');
const settingsController = require('../controllers/settings-controller');
const schedulesController = require('../controllers/schedules-controller');
const indexController = require('../controllers/index-controller');
const { verifyToken } = require('../middlewares/auth');

const BASE = '/api';

const upload = multer();

module.exports = function(app) {
  app.get('/', indexController.get);

  app.use(`${BASE}/schedules`, verifyToken());

  app.get(`${BASE}/schedules`, schedulesController.getSchedules);

  app.post(
    `${BASE}/schedules`,
    upload.single('scheduleFile'),
    schedulesController.createSchedule
  );

  app.put(`${BASE}/schedules/:scheduleId`, schedulesController.updateSchedule);

  app.delete(
    `${BASE}/schedules/:scheduleId`,
    schedulesController.deleteSchedule
  );

  app.get(
    `${BASE}/schedules/:scheduleId/generate`,
    schedulesController.generateSchedule
  );

  app.use(`${BASE}/settings`, verifyToken());

  app.get(`${BASE}/settings`, settingsController.getSettings);

  app.put(`${BASE}/settings/:settingsId`, settingsController.updateSettings);

  app.use(`${BASE}/aggregations`, verifyToken());

  app.get(
    `${BASE}/aggregations/holy-total`,
    aggregationsController.getHolyTotal
  );

  app.get(
    `${BASE}/aggregations/weekly-wage-data`,
    aggregationsController.getWeeklyWageData
  );

  app.get(
    `${BASE}/auth/google`,
    passport.authenticate('google-token', { session: false }),
    authController.authenticate
  );
};
