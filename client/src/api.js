const BASE = '/api';

function getDefaultHeaders(token) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export async function generateScheduleWithFileAndPerson(token, file) {
  const form = new FormData();
  form.append('scheduleFile', file);

  return fetch(`${BASE}/schedules`, {
    method: 'POST',
    body: form,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(response => response.json());
}

export async function fetchScheduleForPerson(
  token,
  scheduleId,
  person,
  hourlyWage
) {
  return fetch(
    `${BASE}/schedules/${scheduleId}/generate?person=${person}&hourlyWage=${hourlyWage}`,
    {
      headers: getDefaultHeaders(token),
    }
  ).then(response => response.json());
}

export async function fetchSchedules(token) {
  return fetch(`${BASE}/schedules`, { headers: getDefaultHeaders(token) }).then(
    response => response.json()
  );
}

export async function fetchSettings(token) {
  return fetch(`${BASE}/settings`, { headers: getDefaultHeaders(token) }).then(
    response => response.json()
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

export function updateSchedule(token, scheduleId, data) {
  return fetch(`${BASE}/schedules/${scheduleId}`, {
    method: 'PUT',
    headers: getDefaultHeaders(token),
    body: JSON.stringify(data),
  }).then(response => response.json());
}

export function updateSettings(token, settingsId, hourlyWage, person) {
  return fetch(`${BASE}/settings/${settingsId}`, {
    method: 'PUT',
    headers: getDefaultHeaders(token),
    body: JSON.stringify({
      hourlyWage,
      person,
    }),
  }).then(response => response.json());
}

export function deleteSchedule(token, scheduleId) {
  return fetch(`${BASE}/schedules/${scheduleId}`, {
    method: 'DELETE',
    headers: getDefaultHeaders(token),
  }).then(response => response.json());
}

export function fetchHolyTotal(token, person, hourlyWage) {
  return fetch(
    `${BASE}/aggregations/holy-total?person=${person}&hourlyWage=${hourlyWage}`,
    {
      headers: getDefaultHeaders(token),
    }
  ).then(response => response.json());
}

export function fetchWeeklyWageDataAggregation(token, person, hourlyWage) {
  return fetch(
    `${BASE}/aggregations/weekly-wage-data?person=${person}&hourlyWage=${hourlyWage}`,
    {
      headers: getDefaultHeaders(token),
    }
  ).then(response => response.json());
}

export function authenticateWithGoogle(accessToken) {
  return fetch(`${BASE}/auth/google?access_token=${accessToken}`).then(
    response => response.json()
  );
}
