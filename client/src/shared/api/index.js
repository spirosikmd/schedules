import ApiError from './ApiError';

export const BASE = '/api';

export function getDefaultHeaders() {
  return {
    'Content-Type': 'application/json',
  };
}

export async function updateSchedule(scheduleId, data) {
  const response = await fetch(`${BASE}/schedules/${scheduleId}`, {
    method: 'PUT',
    headers: getDefaultHeaders(),
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function fetchSchedule(scheduleId) {
  return fetch(`${BASE}/schedules/${scheduleId}`, {
    headers: getDefaultHeaders(),
  }).then(response => response.json());
}

export async function checkToken() {
  const response = await fetch(`${BASE}/auth/token`);
  if (response.status === 200) {
    return response;
  }
  throw new ApiError('Token not valid', response.error);
}
