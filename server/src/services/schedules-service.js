const Schedule = require('../models/schedule');
const User = require('../models/user');
const ScheduleEntry = require('../models/schedule-entry');

function generateSchedule(userId, scheduleName, scheduleEntryData, hourlyWage) {
  return new Promise((resolve, reject) => {
    User.findById(userId, (err, user) => {
      if (err) {
        return reject(err);
      }

      if (user === null) {
        return reject('Cannot save schedule data');
      }

      const data = {
        name: scheduleName,
        user: user._id,
        settings: {
          hourlyWage,
        },
      };

      Schedule.create(data, (err, schedule) => {
        if (err) {
          return reject(err);
        }

        const scheduleEntryDataWithSchedule = scheduleEntryData.map(
          scheduleEntry => ({
            ...scheduleEntry,
            schedule: schedule._id,
            user: user._id,
          })
        );

        ScheduleEntry.insertMany(scheduleEntryDataWithSchedule, err => {
          if (err) {
            return reject(err);
          }

          resolve(schedule);
        });
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
        return reject('Cannot get schedules');
      }

      Schedule.find({ user: user._id })
        .sort('-createdAt')
        .exec((err, schedules) => {
          if (err) {
            return reject(err);
          }

          const simplifiedSchedules = schedules.map(schedule => ({
            id: schedule._id,
            name: schedule.name,
            eventsCreatedOnce: schedule.eventsCreatedOnce,
            createdAt: schedule.createdAt,
          }));

          resolve(simplifiedSchedules);
        });
    });
  });
}

function getSchedule(userId, scheduleId) {
  return new Promise((resolve, reject) => {
    User.findById(userId, (err, user) => {
      if (err) {
        return reject(err);
      }

      if (user === null) {
        return reject('Cannot get schedule data');
      }

      Schedule.findOne(
        { _id: scheduleId, user: user._id },
        (err, foundSchedule) => {
          if (err || foundSchedule === null) {
            return reject(err);
          }

          const hourlyWage = foundSchedule.settings.hourlyWage;

          ScheduleEntry.find({
            schedule: foundSchedule._id,
            user: user._id,
          })
            .sort('date')
            .exec((err, scheduleEntries) => {
              if (err) {
                reject(err);
              }

              const schedule = scheduleEntries.map(scheduleEntry => ({
                id: scheduleEntry._id,
                date: scheduleEntry.date,
                location: scheduleEntry.location,
                startTime: scheduleEntry.startTime,
                endTime: scheduleEntry.endTime,
                dayWage: scheduleEntry.hours * hourlyWage,
                workWith: scheduleEntry.workWith,
                hours: scheduleEntry.hours,
                isWorkingAlone: scheduleEntry.isWorkingAlone,
              }));

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
            });
        }
      );
    });
  });
}

function updateSchedule(
  userId,
  scheduleId,
  { name, eventsCreatedOnce, settings }
) {
  return new Promise((resolve, reject) => {
    User.findById(userId, (err, user) => {
      if (err) {
        return reject(err);
      }

      if (user === null) {
        return reject('Cannot update schedule');
      }

      const doc = {
        ...(name && { name }),
        ...(eventsCreatedOnce !== undefined && { eventsCreatedOnce }),
        ...(settings && { settings }),
      };

      Schedule.findOneAndUpdate(
        { _id: scheduleId, user: user._id },
        doc,
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
        return reject('Cannot delete schedule');
      }

      Schedule.findOne({ user: user._id, _id: scheduleId }, (err, schedule) => {
        if (err) {
          return reject(err);
        }

        if (schedule === null) {
          return reject('Schedule not found');
        }

        schedule.remove().then(() => {
          resolve({ message: 'Schedule successfully deleted' });
        });
      });
    });
  });
}

function createSchedule(userId, data) {
  return new Promise((resolve, reject) => {
    User.findById(userId, (err, user) => {
      if (err) {
        return reject(err);
      }

      if (user === null) {
        return reject('Cannot create schedule');
      }

      const doc = {
        name: data.name,
        user: userId,
      };

      Schedule.create(doc, (err, schedule) => {
        if (err) {
          return reject(err);
        }

        resolve(schedule);
      });
    });
  });
}

function createEntriesForSchedule(userId, scheduleId, entries) {
  return new Promise((resolve, reject) => {
    User.findById(userId, (err, user) => {
      if (err) {
        return reject(err);
      }

      if (user === null) {
        return reject('Cannot create schedule entry');
      }

      Schedule.findOne({ _id: scheduleId, user: user._id }, (err, schedule) => {
        if (err) {
          return reject(err);
        }

        if (schedule === null) {
          return reject('Cannot create schedule entry, schedule not found');
        }

        const executions = entries.map(
          ({
            date,
            hours,
            startTime,
            endTime,
            location,
            workWith,
            isWorkingAlone,
          }) => {
            const doc = {
              date,
              hours,
              startTime,
              endTime,
              location,
              workWith,
              isWorkingAlone,
              user: user._id,
              schedule: schedule._id,
            };

            return new Promise((resolve, reject) => {
              ScheduleEntry.create(doc, (err, scheduleEntry) => {
                if (err) {
                  return reject(err);
                }

                resolve(scheduleEntry);
              });
            });
          }
        );

        Promise.all(executions)
          .then(scheduleEntries => {
            resolve(scheduleEntries);
          })
          .catch(err => {
            reject(err);
          });
      });
    });
  });
}

function updateEntryForSchedule(
  userId,
  scheduleId,
  entryId,
  { hours, date, startTime, endTime, location, workWith, isWorkingAlone }
) {
  return new Promise((resolve, reject) => {
    const doc = {
      ...(hours !== undefined && { hours }),
      ...(date !== undefined && { date }),
      ...(startTime !== undefined && { startTime }),
      ...(endTime !== undefined && { endTime }),
      ...(location !== undefined && { location }),
      ...(workWith !== undefined && { workWith }),
      ...(isWorkingAlone !== undefined && { isWorkingAlone }),
    };

    ScheduleEntry.findOneAndUpdate(
      { user: userId, schedule: scheduleId, _id: entryId },
      doc,
      { new: true },
      (err, scheduleEntry) => {
        if (err) {
          return reject(err);
        }

        if (scheduleEntry === null) {
          return reject('Cannot update schedule entry');
        }

        resolve(scheduleEntry);
      }
    );
  });
}

function deleteEntryForSchedule(userId, scheduleId, entryId) {
  return new Promise((resolve, reject) => {
    ScheduleEntry.findOneAndDelete(
      { user: userId, schedule: scheduleId, _id: entryId },
      err => {
        if (err) {
          return reject(err);
        }

        resolve({ message: 'Schedule entry successfully deleted' });
      }
    );
  });
}

module.exports = {
  getSchedule,
  generateSchedule,
  getSchedules,
  updateSchedule,
  deleteSchedule,
  createSchedule,
  createEntriesForSchedule,
  updateEntryForSchedule,
  deleteEntryForSchedule,
};
