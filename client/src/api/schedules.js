import { BASE, getDefaultHeaders } from './shared';

class ApiError extends Error {
  constructor(message, errors) {
    super(message);

    this.errors = errors;
  }
}

export async function generateScheduleWithFileAndPerson(file, hourlyWage) {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const form = new FormData();
  form.append('scheduleFile', file);
  form.append('timezone', timezone);
  form.append('hourlyWage', hourlyWage);

  return fetch(`${BASE}/schedules/generate`, {
    method: 'POST',
    body: form,
  }).then(response => {
    if (response.status >= 400) {
      return response.json().then(json => {
        throw new ApiError('Cannot generate schedule', json.errors);
      });
    }

    return response.json();
  });
}

export async function fetchScheduleForPerson(scheduleId, person) {
  return fetch(`${BASE}/schedules/${scheduleId}?person=${person}`, {
    headers: getDefaultHeaders(),
  }).then(response => response.json());
}

export async function fetchSchedules() {
  return fetch(`${BASE}/schedules`, { headers: getDefaultHeaders() }).then(
    response => response.json()
  );
}

export function updateSchedule(scheduleId, data) {
  return fetch(`${BASE}/schedules/${scheduleId}`, {
    method: 'PUT',
    headers: getDefaultHeaders(),
    body: JSON.stringify(data),
  }).then(response => response.json());
}

export function deleteSchedule(scheduleId) {
  return fetch(`${BASE}/schedules/${scheduleId}`, {
    method: 'DELETE',
    headers: getDefaultHeaders(),
  }).then(response => response.json());
}

export function createSchedule(data) {
  return fetch(`${BASE}/schedules`, {
    method: 'POST',
    headers: getDefaultHeaders(),
    body: JSON.stringify(data),
  }).then(response => response.json());
}
