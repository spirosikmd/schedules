const mongoose = require('mongoose');
const User = require('../models/user');
const ScheduleEntry = require('../models/schedule-entry');

function createAggregationResponse(data) {
  return { data };
}

function calculateHolyTotal(userId) {
  return new Promise((resolve, reject) => {
    User.findById(userId, (err, user) => {
      if (err) {
        return reject(err);
      }

      if (user === null) {
        return reject('Cannot get holy total');
      }

      ScheduleEntry.find({ user: user._id })
        .populate('schedule', 'settings.hourlyWage')
        .exec((err, scheduleEntries) => {
          if (err) {
            return reject(err);
          }

          let holyTotal = 0;

          scheduleEntries.forEach(scheduleEntry => {
            holyTotal +=
              scheduleEntry.hours * scheduleEntry.schedule.settings.hourlyWage;
          });

          resolve(createAggregationResponse({ holyTotal }));
        });
    });
  });
}

function calculateWeeklyWageData(userId) {
  return new Promise((resolve, reject) => {
    User.findById(userId, (err, user) => {
      if (err) {
        return reject(err);
      }

      if (user === null) {
        return reject('Cannot get weekly wage data');
      }

      ScheduleEntry.aggregate()
        .match({ user: mongoose.Types.ObjectId(user._id) })
        .lookup({
          from: 'schedules',
          localField: 'schedule',
          foreignField: '_id',
          as: 'schedule',
        })
        .group({
          _id: '$schedule',
          weeklyWage: {
            $sum: {
              $multiply: [
                '$hours',
                { $arrayElemAt: ['$schedule.settings.hourlyWage', 0] },
              ],
            },
          },
        })
        .project({
          _id: 0,
          weeklyWage: 1,
          name: { $arrayElemAt: ['$_id.name', 0] },
          createdAt: { $arrayElemAt: ['$_id.createdAt', 0] },
        })
        .sort({ createdAt: 1 })
        .exec((err, weeklyWageData) => {
          if (err) {
            return reject(err);
          }

          resolve(createAggregationResponse({ weeklyWageData }));
        });
    });
  });
}

function calculateWeeklyHourData(userId) {
  return new Promise((resolve, reject) => {
    User.findById(userId, (err, user) => {
      if (err) {
        return reject(err);
      }

      if (user === null) {
        return reject('Cannot get weekly hour data');
      }

      ScheduleEntry.aggregate()
        .match({ user: mongoose.Types.ObjectId(user._id) })
        .lookup({
          from: 'schedules',
          localField: 'schedule',
          foreignField: '_id',
          as: 'schedule',
        })
        .group({ _id: '$schedule', weeklyHours: { $sum: '$hours' } })
        .project({
          _id: 0,
          weeklyHours: 1,
          name: { $arrayElemAt: ['$_id.name', 0] },
          createdAt: { $arrayElemAt: ['$_id.createdAt', 0] },
        })
        .sort({ createdAt: 1 })
        .exec((err, weeklyHourData) => {
          if (err) {
            return reject(err);
          }

          resolve(createAggregationResponse({ weeklyHourData }));
        });
    });
  });
}

function calculateHoursPerLocation(userId) {
  return new Promise((resolve, reject) => {
    User.findById(userId, (err, user) => {
      if (err) {
        return reject(err);
      }

      if (user === null) {
        return reject('Cannot get weekly hour data');
      }

      ScheduleEntry.aggregate()
        .match({ user: mongoose.Types.ObjectId(user._id) })
        .group({ _id: '$location', hours: { $sum: '$hours' } })
        .project({
          _id: 0,
          location: '$_id',
          hours: 1,
        })
        .exec((err, locationHourData) => {
          if (err) {
            return reject(err);
          }

          resolve(createAggregationResponse({ locationHourData }));
        });
    });
  });
}

module.exports = {
  calculateHolyTotal,
  calculateWeeklyWageData,
  calculateWeeklyHourData,
  calculateHoursPerLocation,
};
