const multer = require('multer');
const passport = require('passport');
const { check } = require('express-validator/check');
const authController = require('../controllers/auth-controller');
const aggregationsController = require('../controllers/aggregations-controller');
const schedulesController = require('../controllers/schedules-controller');
const indexController = require('../controllers/index-controller');
const { verifyToken } = require('../middlewares/auth');
const { validationErrors } = require('../middlewares/validation-errors');

const BASE = '/api';

const upload = multer();

module.exports = function(app) {
  app.get('/', indexController.get);

  app.use(`${BASE}/schedules`, verifyToken());

  app.get(`${BASE}/schedules`, schedulesController.getSchedules);

  app.post(
    `${BASE}/schedules`,
    [
      check('name')
        .isString()
        .exists({
          checkFalsy: true,
          checkNull: true,
        }),
    ],
    validationErrors(),
    schedulesController.createSchedule
  );

  app.post(
    `${BASE}/schedules/generate`,
    upload.single('scheduleFile'),
    [
      check('hourlyWage').isFloat({
        min: 0,
      }),
      check('person')
        .isString()
        .exists({
          checkFalsy: true,
          checkNull: true,
        }),
    ],
    validationErrors(),
    schedulesController.generateSchedule
  );

  app.put(`${BASE}/schedules/:scheduleId`, schedulesController.updateSchedule);

  app.delete(
    `${BASE}/schedules/:scheduleId`,
    schedulesController.deleteSchedule
  );

  app.get(`${BASE}/schedules/:scheduleId`, schedulesController.getSchedule);

  app.post(
    `${BASE}/schedules/:scheduleId/entries`,
    [
      check('entries').isArray(),
      check('entries.*.date')
        .isRFC3339()
        .exists({
          checkFalsy: true,
          checkNull: true,
        }),
      check('entries.*.startTime')
        .isRFC3339()
        .exists({
          checkFalsy: true,
          checkNull: true,
        }),
      check('entries.*.endTime')
        .isRFC3339()
        .exists({
          checkFalsy: true,
          checkNull: true,
        }),
      check('entries.*.hours')
        .exists({
          checkFalsy: true,
          checkNull: true,
        })
        .toFloat(),
      check('entries.*.location').isString(),
      check('entries.*.workWith').isArray(),
      check('entries.*.workWith.*').isString(),
    ],
    validationErrors(),
    schedulesController.createEntriesForSchedule
  );

  app.put(
    `${BASE}/schedules/:scheduleId/entries/:entryId`,
    [
      check('date')
        .isRFC3339()
        .exists({
          checkFalsy: true,
          checkNull: true,
        }),
      check('hours')
        .exists({
          checkFalsy: true,
          checkNull: true,
        })
        .toFloat(),
      check('entries.*.startTime')
        .isRFC3339()
        .exists({
          checkFalsy: true,
          checkNull: true,
        }),
      check('entries.*.endTime')
        .isRFC3339()
        .exists({
          checkFalsy: true,
          checkNull: true,
        }),
      check('entries.*.location').isString(),
      check('entries.*.workWith').isArray(),
      check('entries.*.workWith.*').isString(),
    ],
    validationErrors(),
    schedulesController.updateEntryForSchedule
  );

  app.delete(
    `${BASE}/schedules/:scheduleId/entries/:entryId`,
    schedulesController.deleteEntryForSchedule
  );

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
    `${BASE}/aggregations/weekly-hour-data`,
    aggregationsController.getWeeklyHourData
  );

  app.get(
    `${BASE}/aggregations/location-hour-data`,
    aggregationsController.getLocationHourData
  );

  app.get(
    `${BASE}/auth/google`,
    passport.authenticate('google-token', { session: false }),
    authController.authenticate
  );

  app.get(`${BASE}/auth/token`, verifyToken(), function(req, res) {
    res.sendStatus(200);
  });
};
