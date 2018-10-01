const Schedule = require('../models/schedule');
const User = require('../models/user');

function saveScheduleData(userId, scheduleName, scheduleData) {
  return new Promise((resolve, reject) => {
    User.findById(userId, (err, user) => {
      if (err) {
        return reject(err);
      }

      if (user === null) {
        return reject(`Cannot save schedule data`);
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

function getSchedules(userId) {
  return new Promise((resolve, reject) => {
    User.findById(userId, (err, user) => {
      if (err) {
        return reject(err);
      }

      if (user === null) {
        return reject(`Cannot get schedules`);
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

function getScheduleDataForPerson(userId, scheduleId, person) {
  return new Promise((resolve, reject) => {
    User.findById(userId, (err, user) => {
      if (err) {
        return reject(err);
      }

      if (user === null) {
        return reject(`Cannot get schedule data`);
      }

      Schedule.findOne(
        { _id: scheduleId, user: user._id },
        (err, foundSchedule) => {
          if (err || foundSchedule === null) {
            return reject(err);
          }

          const scheduleData = foundSchedule.data;
          const hourlyWage = foundSchedule.settings.hourlyWage;

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
                    dayWage: employee.hours * hourlyWage,
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
            settings: foundSchedule.settings,
          });
        }
      );
    });
  });
}

function updateSchedule(userId, scheduleId, data) {
  return new Promise((resolve, reject) => {
    User.findById(userId, (err, user) => {
      if (err) {
        return reject(err);
      }

      if (user === null) {
        return reject(`Cannot update schedule`);
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

function deleteSchedule(userId, scheduleId) {
  return new Promise((resolve, reject) => {
    User.findById(userId, (err, user) => {
      if (err) {
        return reject(err);
      }

      if (user === null) {
        return reject(`Cannot delete schedule`);
      }

      Schedule.findOneAndDelete({ user: user._id, _id: scheduleId }, err => {
        if (err) {
          return reject(err);
        }

        resolve({ message: 'Schedule successfully deleted' });
      });
    });
  });
}

module.exports = {
  getScheduleDataForPerson,
  saveScheduleData,
  getSchedules,
  updateSchedule,
  deleteSchedule,
};
