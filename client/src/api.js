const BASE = '/api';

export async function generateScheduleWithFileAndPerson(userEmail, file) {
  const form = new FormData();
  form.append('scheduleFile', file);

  return fetch(`${BASE}/schedules?userEmail=${userEmail}`, {
    method: 'POST',
    body: form,
  }).then(response => response.json());
}

export async function fetchScheduleForPerson(
  userEmail,
  scheduleId,
  person,
  hourlyWage
) {
  return fetch(
    `${BASE}/schedules/${scheduleId}/generate?person=${person}&hourlyWage=${hourlyWage}&userEmail=${userEmail}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  ).then(response => response.json());
}

export async function fetchSchedules(userEmail) {
  return fetch(`${BASE}/schedules?userEmail=${userEmail}`).then(response =>
    response.json()
  );
}

export async function fetchSettings(userEmail) {
  return fetch(`${BASE}/settings?userEmail=${userEmail}`).then(response =>
    response.json()
  );
}

function createEventObject(scheduleItem) {
  return {
    summary: 'ACC',
    description: `You work with: ${scheduleItem.worksWith.join(',')}`,
    location: scheduleItem.location,
    start: {
      dateTime: scheduleItem.startTime,
    },
    end: {
      dateTime: scheduleItem.endTime,
    },
  };
}

export function createEvents(schedule) {
  const createEventRequests = schedule.map(scheduleItem => {
    return window.gapi.client
      .request({
        path: 'https://www.googleapis.com/calendar/v3/calendars/primary/events',
        method: 'POST',
        body: createEventObject(scheduleItem),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.result);
  });

  return Promise.all(createEventRequests);
}

export function updateSchedule(userEmail, scheduleId, data) {
  return fetch(`${BASE}/schedules/${scheduleId}?userEmail=${userEmail}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then(response => response.json());
}

export function updateSettings(userEmail, settingsId, hourlyWage, person) {
  return fetch(`${BASE}/settings/${settingsId}?userEmail=${userEmail}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      hourlyWage,
      person,
    }),
  }).then(response => response.json());
}

export function createUser(email) {
  return fetch(`${BASE}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
    }),
  }).then(response => response.json());
}
