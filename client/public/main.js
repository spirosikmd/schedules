const { ipcMain } = require('electron');
const {
  saveScheduleData,
  getScheduleDataForPerson,
} = require('../../server/db');
const { parseScheduleFileWithPath } = require('../../server/parser');

ipcMain.on('api:schedule', (event, { person, hourlyWage }) => {
  getScheduleDataForPerson(person, hourlyWage)
    .then(data => {
      event.sender.send('api:schedule:success', data);
    })
    .catch(error => {
      event.sender.send('api:schedule:fail', {
        message: error,
      });
    });
});

ipcMain.on('api:upload', (event, filePath) => {
  const scheduleData = parseScheduleFileWithPath(filePath);

  saveScheduleData(scheduleData)
    .then(message => {
      event.sender.send('api:upload:success', {
        message,
      });
    })
    .catch(error =>
      event.sender.send('api:upload:fail', {
        message: error,
      })
    );
});
