const Schedule = require('../models/schedule');
const User = require('../models/user');

function saveScheduleData(userEmail, scheduleName, scheduleData) {
  return new Promise((resolve, reject) => {
    User.findOne({ email: userEmail }, (err, user) => {
      if (err) {
        return reject(err);
      }

      if (user === null) {
        return reject(
          `Cannot save schedule data for user with email ${userEmail}`
        );
      }

      const data = {
        name: scheduleName,
        data: scheduleData,
        user: user._id,
      };

      Schedule.create(data, (err, schedule) => {
        if (err) {
          return reject(err);
        }

        resolve(schedule);
      });
    });
  });
}

function getSchedules(userEmail) {
  return new Promise((resolve, reject) => {
    User.findOne({ email: userEmail }, (err, user) => {
      if (err) {
        return reject(err);
      }

      if (user === null) {
        return reject(`Cannot get schedules for user with email ${userEmail}`);
      }

      Schedule.find({ user: user._id }, (err, schedules) => {
        if (err) {
          return reject(err);
        }

        const simplifiedSchedules = schedules.map(schedule => ({
          id: schedule._id,
          name: schedule.name,
          eventsCreatedOnce: schedule.eventsCreatedOnce,
        }));

        resolve(simplifiedSchedules);
      });
    });
  });
}

function getScheduleDataForPerson(userEmail, scheduleId, person, hourlyWage) {
  return new Promise((resolve, reject) => {
    User.findOne({ email: userEmail }, (err, user) => {
      if (err) {
        return reject(err);
      }

      if (user === null) {
        return reject(
          `Cannot get schedule data for user with email ${userEmail}`
        );
      }

      Schedule.findOne(
        { _id: scheduleId, user: user._id },
        (err, foundSchedule) => {
          if (err || foundSchedule === null) {
            return reject(err);
          }

          const scheduleData = foundSchedule.data;

          const schedule = [];

          scheduleData.forEach(daySchedule => {
            daySchedule.locations.forEach(location => {
              location.employees.forEach(employee => {
                if (employee.name === person) {
                  schedule.push({
                    date: daySchedule.date,
                    location: location.name,
                    startTime: employee.startTime,
                    endTime: employee.endTime,
                    hours: employee.hours,
                    worksWith: location.employees
                      .filter(employee => employee.name !== person)
                      .map(employee => employee.name),
                  });
                }
              });
            });
          });

          const totalHours = schedule.reduce(
            (acc, current) => acc + current.hours,
            0
          );

          resolve({
            schedule,
            totalHours,
            totalWeeklyWage: totalHours * hourlyWage,
            name: foundSchedule.name,
            eventsCreatedOnce: foundSchedule.eventsCreatedOnce,
          });
        }
      );
    });
  });
}

function updateSchedule(userEmail, scheduleId, data) {
  return new Promise((resolve, reject) => {
    User.findOne({ email: userEmail }, (err, user) => {
      if (err) {
        return reject(err);
      }

      if (user === null) {
        return reject(
          `Cannot update schedule for user with email ${userEmail}`
        );
      }

      Schedule.findOneAndUpdate(
        { _id: scheduleId, user: user._id },
        data,
        { new: true },
        (err, schedule) => {
          if (err || schedule === null) {
            return reject(err);
          }

          resolve(schedule);
        }
      );
    });
  });
}

module.exports = {
  getScheduleDataForPerson,
  saveScheduleData,
  getSchedules,
  updateSchedule,
};
