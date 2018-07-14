const multer = require('multer');
const passport = require('passport');
const authController = require('../controllers/auth-controller');
const aggregationsController = require('../controllers/aggregations-controller');
const settingsController = require('../controllers/settings-controller');
const schedulesController = require('../controllers/schedules-controller');
const indexController = require('../controllers/index-controller');
const authMiddleware = require('../middlewares/auth');

const BASE = '/api';

const upload = multer();

module.exports = function(app) {
  app.get('/', indexController.get);

  app.get(
    `${BASE}/schedules`,
    authMiddleware.verifyToken,
    schedulesController.getSchedules
  );

  app.post(
    `${BASE}/schedules`,
    authMiddleware.verifyToken,
    upload.single('scheduleFile'),
    schedulesController.createSchedule
  );

  app.put(
    `${BASE}/schedules/:scheduleId`,
    authMiddleware.verifyToken,
    schedulesController.updateSchedule
  );

  app.delete(
    `${BASE}/schedules/:scheduleId`,
    authMiddleware.verifyToken,
    schedulesController.deleteSchedule
  );

  app.get(
    `${BASE}/schedules/:scheduleId/generate`,
    authMiddleware.verifyToken,
    schedulesController.generateSchedule
  );

  app.get(
    `${BASE}/settings`,
    authMiddleware.verifyToken,
    settingsController.getSettings
  );

  app.put(
    `${BASE}/settings/:settingsId`,
    authMiddleware.verifyToken,
    settingsController.updateSettings
  );

  app.get(
    `${BASE}/aggregations/holy-total`,
    authMiddleware.verifyToken,
    aggregationsController.getHolyTotal
  );

  app.get(
    `${BASE}/aggregations/weekly-wage-data`,
    authMiddleware.verifyToken,
    aggregationsController.getWeeklyWageData
  );

  app.get(
    `${BASE}/auth/google`,
    passport.authenticate('google-token', { session: false }),
    authController.authenticate
  );
};
