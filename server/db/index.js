const fs = require('fs');

const DB_FILE_PATH = `${__dirname}/db.json`;

module.exports = {
  getScheduleDataForPerson,
  saveScheduleData,
};

function saveScheduleData(scheduleData) {
  return new Promise((resolve, reject) => {
    fs.writeFile(DB_FILE_PATH, JSON.stringify(scheduleData), 'utf8', error => {
      if (error) {
        return reject('Error parsing schedule file.');
      }

      resolve('Ok');
    });
  });
}

function getScheduleDataForPerson(person, hourlyWage) {
  return new Promise((resolve, reject) => {
    fs.readFile(DB_FILE_PATH, (error, data) => {
      if (error) {
        return reject('Error getting schedule file.');
      }

      const scheduleData = JSON.parse(data);
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
      });
    });
  });
}
