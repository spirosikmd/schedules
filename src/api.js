const { ipcRenderer } = window;

export async function generateScheduleWithFileAndPerson(file) {
  ipcRenderer.send('api:upload', file.path);

  return new Promise((resolve, reject) => {
    ipcRenderer.on('api:upload:success', (event, arg) => {
      resolve(arg);
    });

    ipcRenderer.on('api:upload:fail', (event, arg) => {
      reject(arg);
    });
  });
}

export async function fetchScheduleForPerson(person, hourlyWage) {
  ipcRenderer.send('api:schedule', { person, hourlyWage });

  return new Promise((resolve, reject) => {
    ipcRenderer.on('api:schedule:success', (event, arg) => {
      resolve(arg);
    });

    ipcRenderer.on('api:schedule:fail', (event, arg) => {
      reject(arg);
    });
  });
}
