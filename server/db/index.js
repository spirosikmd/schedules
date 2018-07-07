const Store = require('./store');
const uuidv4 = require('uuid/v4');

const store = new Store({
  configName: 'db',
  defaults: {
    schedules: [],
    selectedScheduleId: null,
    settings: {
      hourlyWage: 8.55,
      person: '',
    },
  },
});

module.exports = {
  getScheduleDataForPerson,
  saveScheduleData,
  getSchedules,
  getSelectedScheduleId,
  getSettings,
  updateSchedule,
};

function saveScheduleData(scheduleName, scheduleData) {
  return new Promise((resolve, reject) => {
    const schedules = store.get('schedules');

    const updatedSchedules = [
      ...schedules,
      {
        id: uuidv4(),
        name: scheduleName,
        eventsCreatedOnce: false,
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
      eventsCreatedOnce: schedule.eventsCreatedOnce || false,
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

function getSettings() {
  return new Promise((resolve, reject) => {
    const settings = store.get('settings');

    resolve(settings);
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
    store.set('settings', { hourlyWage, person });

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

function updateSchedule(scheduleId, data) {
  return new Promise((resolve, reject) => {
    const schedules = store.get('schedules');

    const foundScheduleIndex = schedules.findIndex(
      schedule => schedule.id === scheduleId
    );

    if (foundScheduleIndex === -1) {
      return reject(`Schedule with id ${scheduleId} not found`);
    }

    const foundSchedule = schedules[foundScheduleIndex];
    const updatedFoundSchedule = {
      ...foundSchedule,
      ...data,
    };
    const updatedSchedules = [
      ...schedules.slice(0, foundScheduleIndex),
      updatedFoundSchedule,
      ...schedules.slice(foundScheduleIndex + 1),
    ];

    store.set('schedules', updatedSchedules);

    resolve(updatedFoundSchedule);
  });
}
