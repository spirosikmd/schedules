const Store = require('./store');
const uuidv4 = require('uuid/v4');

const store = new Store({
  configName: 'db',
  defaults: {
    schedules: [],
    selectedScheduleId: null,
    hourlyWage: 8.55,
  },
});

module.exports = {
  getScheduleDataForPerson,
  saveScheduleData,
  getSchedules,
  getSelectedScheduleId,
  getHourlyWage,
};

function saveScheduleData(scheduleName, scheduleData) {
  return new Promise((resolve, reject) => {
    const schedules = store.get('schedules');

    const updatedSchedules = [
      ...schedules,
      {
        id: uuidv4(),
        name: scheduleName,
        data: scheduleData,
      },
    ];
    store.set('schedules', updatedSchedules);

    resolve('ok');
  });
}

function getSchedules() {
  return new Promise((resolve, reject) => {
    const schedules = store.get('schedules');

    const simplifiedSchedules = schedules.map(schedule => ({
      id: schedule.id,
      name: schedule.name,
    }));

    resolve(simplifiedSchedules);
  });
}

function getSelectedScheduleId() {
  return new Promise((resolve, reject) => {
    const selectedScheduleId = store.get('selectedScheduleId');

    resolve(selectedScheduleId);
  });
}

function getHourlyWage() {
  return new Promise((resolve, reject) => {
    const hourlyWage = store.get('hourlyWage');

    resolve(hourlyWage);
  });
}

function getScheduleDataForPerson(scheduleId, person, hourlyWage) {
  return new Promise((resolve, reject) => {
    const schedules = store.get('schedules');

    const foundSchedule = schedules.find(
      schedule => schedule.id === scheduleId
    );

    if (!foundSchedule) {
      return reject(`Schedule with id ${scheduleId} not found`);
    }

    store.set('selectedScheduleId', scheduleId);
    store.set('hourlyWage', hourlyWage);

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
    });
  });
}
