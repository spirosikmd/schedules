import { BASE, getDefaultHeaders } from '../../shared/api';

export async function deleteSchedule(scheduleId) {
  const response = await fetch(`${BASE}/schedules/${scheduleId}`, {
    method: 'DELETE',
    headers: getDefaultHeaders(),
  });
  return response.json();
}
