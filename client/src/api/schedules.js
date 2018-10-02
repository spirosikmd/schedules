import { BASE, getDefaultHeaders } from './shared';

export async function generateScheduleWithFileAndPerson(file) {
  const form = new FormData();
  form.append('scheduleFile', file);

  return fetch(`${BASE}/schedules/generate`, {
    method: 'POST',
    body: form,
  }).then(response => response.json());
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
