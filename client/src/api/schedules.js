import { BASE, getDefaultHeaders } from './shared';
import ApiError from './ApiError';

export async function generateScheduleWithFileAndPerson(file, hourlyWage) {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const form = new FormData();
  form.append('scheduleFile', file);
  form.append('timezone', timezone);
  form.append('hourlyWage', hourlyWage);

  return fetch(`${BASE}/schedules/generate`, {
    method: 'POST',
    body: form,
  }).then(async response => {
    const json = await response.json();
    if (response.status < 400) {
      return json;
    }
    throw new ApiError('Cannot generate schedule', json.errors);
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

export async function updateSchedule(scheduleId, data) {
  const response = await fetch(`${BASE}/schedules/${scheduleId}`, {
    method: 'PUT',
    headers: getDefaultHeaders(),
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function deleteSchedule(scheduleId) {
  const response = await fetch(`${BASE}/schedules/${scheduleId}`, {
    method: 'DELETE',
    headers: getDefaultHeaders(),
  });
  return response.json();
}

export async function createSchedule(data) {
  const response = await fetch(`${BASE}/schedules`, {
    method: 'POST',
    headers: getDefaultHeaders(),
    body: JSON.stringify(data),
  });
  return response.json();
}
