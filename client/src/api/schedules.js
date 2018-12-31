import { BASE, getDefaultHeaders } from '../shared/api';
import ApiError from '../shared/ApiError';

export async function generateScheduleWithFileAndPerson(
  file,
  hourlyWage,
  person
) {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const form = new FormData();
  form.append('scheduleFile', file);
  form.append('timezone', timezone);
  form.append('hourlyWage', hourlyWage);
  form.append('person', person);

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

export async function fetchSchedule(scheduleId) {
  return fetch(`${BASE}/schedules/${scheduleId}`, {
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

export async function createScheduleEntries(scheduleId, data) {
  const response = await fetch(`${BASE}/schedules/${scheduleId}/entries`, {
    method: 'POST',
    headers: getDefaultHeaders(),
    body: JSON.stringify(data),
  });
  const json = await response.json();
  if (response.status < 400) {
    return json;
  }
  throw new ApiError('Cannot create schedule entry', json.errors);
}

export async function deleteScheduleEntry(scheduleId, entryId) {
  const response = await fetch(
    `${BASE}/schedules/${scheduleId}/entries/${entryId}`,
    {
      method: 'DELETE',
      headers: getDefaultHeaders(),
    }
  );
  const json = await response.json();
  if (response.status < 400) {
    return json;
  }
  throw new ApiError('Cannot delete schedule entry', json.errors);
}

export async function updateScheduleEntry(scheduleId, entryId, data) {
  const response = await fetch(
    `${BASE}/schedules/${scheduleId}/entries/${entryId}`,
    {
      method: 'PUT',
      headers: getDefaultHeaders(),
      body: JSON.stringify(data),
    }
  );
  const json = await response.json();
  if (response.status < 400) {
    return json;
  }
  throw new ApiError('Cannot update schedule entry', json.errors);
}
