import { BASE, getDefaultHeaders } from '../../shared/api';
import ApiError from '../../shared/api/ApiError';

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

export async function createSchedule(data) {
  const response = await fetch(`${BASE}/schedules`, {
    method: 'POST',
    headers: getDefaultHeaders(),
    body: JSON.stringify(data),
  });
  return response.json();
}
