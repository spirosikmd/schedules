const User = require('../models/user');
const Schedule = require('../models/schedule');
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

      ScheduleEntry.find({ user: user._id })
        .populate('schedule')
        .exec((err, scheduleEntries) => {
          if (err) {
            return reject(err);
          }

          const weeklyWageData = [];

          scheduleEntries.forEach(scheduleEntry => {
            const scheduleCreatedAt = scheduleEntry.schedule.createdAt;
            const scheduleName = scheduleEntry.schedule.name;
            const scheduleId = scheduleEntry.schedule._id;
            const scheduleHourlyWage =
              scheduleEntry.schedule.settings.hourlyWage;
            const foundWeeklyWageDataSchedule = weeklyWageData.find(
              weeklyWageDataSchedule => weeklyWageDataSchedule.id === scheduleId
            );
            if (foundWeeklyWageDataSchedule) {
              foundWeeklyWageDataSchedule.weeklyWage +=
                scheduleEntry.hours * scheduleHourlyWage;
            } else {
              weeklyWageData.push({
                id: scheduleId,
                name: scheduleName,
                createdAt: scheduleCreatedAt,
                weeklyWage: scheduleEntry.hours * scheduleHourlyWage,
              });
            }
          });

          weeklyWageData.sort((a, b) => a.createdAt - b.createdAt);

          resolve(createAggregationResponse({ weeklyWageData }));
        });
    });
  });
}

module.exports = {
  calculateHolyTotal,
  calculateWeeklyWageData,
};
