const { ipcRenderer } = window;

export async function generateScheduleWithFileAndPerson(file) {
  ipcRenderer.send('api:upload', file.name, file.path);

  return new Promise((resolve, reject) => {
    ipcRenderer.on('api:upload:success', (event, arg) => {
      resolve(arg);
    });

    ipcRenderer.on('api:upload:fail', (event, arg) => {
      reject(arg);
    });
  });
}

export async function fetchScheduleForPerson(scheduleId, person, hourlyWage) {
  ipcRenderer.send('api:schedule', { scheduleId, person, hourlyWage });

  return new Promise((resolve, reject) => {
    ipcRenderer.on('api:schedule:success', (event, arg) => {
      resolve(arg);
    });

    ipcRenderer.on('api:schedule:fail', (event, arg) => {
      reject(arg);
    });
  });
}

export async function fetchSchedules() {
  ipcRenderer.send('api:schedules');

  return new Promise((resolve, reject) => {
    ipcRenderer.on('api:schedules:success', (event, arg) => {
      resolve(arg);
    });

    ipcRenderer.on('api:schedules:fail', (event, arg) => {
      reject(arg);
    });
  });
}

export async function fetchHourlyWage() {
  ipcRenderer.send('api:hourlyWage');

  return new Promise((resolve, reject) => {
    ipcRenderer.on('api:hourlyWage:success', (event, arg) => {
      resolve(arg);
    });

    ipcRenderer.on('api:hourlyWage:fail', (event, arg) => {
      reject(arg);
    });
  });
}

export async function fetchSelectedScheduleId() {
  ipcRenderer.send('api:scheduleId');

  return new Promise((resolve, reject) => {
    ipcRenderer.on('api:scheduleId:success', (event, arg) => {
      resolve(arg);
    });

    ipcRenderer.on('api:scheduleId:fail', (event, arg) => {
      reject(arg);
    });
  });
}
