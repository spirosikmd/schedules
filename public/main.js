const { ipcMain } = require('electron');
const {
  saveScheduleData,
  getScheduleDataForPerson,
  getSchedules,
  getSelectedScheduleId,
  getHourlyWage,
  updateSchedule,
} = require('./db');
const { parseScheduleFileWithPath } = require('./parser');

ipcMain.on('api:schedule', (event, { scheduleId, person, hourlyWage }) => {
  getScheduleDataForPerson(scheduleId, person.toLowerCase(), hourlyWage)
    .then(data => {
      event.sender.send('api:schedule:success', data);
    })
    .catch(error => {
      event.sender.send('api:schedule:fail', {
        message: error,
      });
    });
});

ipcMain.on('api:scheduleId', event => {
  getSelectedScheduleId()
    .then(data => event.sender.send('api:scheduleId:success', data))
    .catch(error => {
      event.sender.send('api:scheduleId:fail', {
        message: error,
      });
    });
});

ipcMain.on('api:upload', (event, fileName, filePath) => {
  const scheduleData = parseScheduleFileWithPath(filePath);

  saveScheduleData(fileName, scheduleData)
    .then(data => event.sender.send('api:upload:success', data))
    .catch(error =>
      event.sender.send('api:upload:fail', {
        message: error,
      })
    );
});

ipcMain.on('api:schedules', event => {
  getSchedules()
    .then(data => event.sender.send('api:schedules:success', data))
    .catch(error => {
      event.sender.send('api:schedules:fail', {
        message: error,
      });
    });
});

ipcMain.on('api:hourlyWage', event => {
  getHourlyWage()
    .then(data => event.sender.send('api:hourlyWage:success', data))
    .catch(error => {
      event.sender.send('api:hourlyWage:fail', {
        message: error,
      });
    });
});

ipcMain.on('api:updateSchedule', (event, scheduleId, data) => {
  updateSchedule(scheduleId, data)
    .then(data => event.sender.send('api:updateSchedule:success', data))
    .catch(error =>
      event.sender.send('api:updateSchedule:fail', {
        message: error,
      })
    );
});
