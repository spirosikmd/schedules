const User = require('../models/user');
const Schedule = require('../models/schedule');

function createAggregationResponse(data) {
  return { data };
}

function calculateHolyTotal(userId, person, hourlyWage) {
  return new Promise((resolve, reject) => {
    User.findById(userId, (err, user) => {
      if (err) {
        return reject(err);
      }

      if (user === null) {
        return reject(`Cannot get holy total`);
      }

      Schedule.find({ user: user._id }, (err, schedules) => {
        if (err) {
          return reject(err);
        }

        let holyTotal = 0;

        schedules.forEach(schedule => {
          schedule.data.forEach(daySchedule => {
            daySchedule.locations.forEach(location => {
              location.employees.forEach(employee => {
                if (employee.name === person) {
                  holyTotal += employee.hours * hourlyWage;
                }
              });
            });
          });
        });

        resolve(createAggregationResponse({ holyTotal }));
      });
    });
  });
}

function calculateWeeklyWageData(userId, person, hourlyWage) {
  return new Promise((resolve, reject) => {
    User.findById(userId, (err, user) => {
      if (err) {
        return reject(err);
      }

      if (user === null) {
        return reject(`Cannot get weekly wage data`);
      }

      Schedule.find({ user: user._id }, (err, schedules) => {
        if (err) {
          return reject(err);
        }

        const weeklyWageData = {};

        schedules.forEach(schedule => {
          schedule.data.forEach(daySchedule => {
            daySchedule.locations.forEach(location => {
              location.employees.forEach(employee => {
                if (employee.name === person) {
                  weeklyWageData[schedule.name] =
                    (weeklyWageData[schedule.name] || 0) +
                    employee.hours * hourlyWage;
                }
              });
            });
          });
        });

        resolve(createAggregationResponse({ weeklyWageData }));
      });
    });
  });
}

module.exports = {
  calculateHolyTotal,
  calculateWeeklyWageData,
};
