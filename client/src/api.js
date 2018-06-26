const BASE = '/api';
const ipcRenderer = window.ipcRenderer;

export async function generateScheduleWithFileAndPerson(file) {
  const data = new FormData();
  data.set('scheduleFile', file);

  const response = await fetch(`${BASE}/upload`, {
    method: 'post',
    body: data,
  });

  const body = await response.json();

  if (response.status !== 200) throw Error(body.message);

  return body;
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
