import { BASE, getDefaultHeaders } from '../../shared/api';
import ApiError from '../../shared/api/ApiError';

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

function createEventObject(scheduleItem) {
  return {
    summary: 'ACC',
    description: `You work with: ${scheduleItem.workWith.join(',')}`,
    location: scheduleItem.location,
    start: {
      dateTime: new Date(scheduleItem.startTime),
    },
    end: {
      dateTime: new Date(scheduleItem.endTime),
    },
  };
}

function sanitizeSchedule(scheduleItem) {
  return (
    scheduleItem.startTime !== undefined && scheduleItem.endTime !== undefined
  );
}

export function createEvents(schedule) {
  const createEventRequests = schedule
    .filter(sanitizeSchedule)
    .map(scheduleItem => {
      return window.gapi.client
        .request({
          path:
            'https://www.googleapis.com/calendar/v3/calendars/primary/events',
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
