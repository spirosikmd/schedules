const electron = require('electron');
const ipcMain = electron.ipcMain;

const { getScheduleDataForPerson } = require('../../server/db');

ipcMain.on('api:schedule', (event, { person, hourlyWage }) => {
  getScheduleDataForPerson(person, hourlyWage)
    .then(data => {
      event.sender.send('api:schedule:success', data);
    })
    .catch(error => {
      return event.sender.send('api:schedule:fail', {
        message: error,
      });
    });
});
