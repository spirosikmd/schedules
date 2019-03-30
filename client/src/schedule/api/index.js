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
  let eventObject = {
    summary: 'ACC',
    ...(scheduleItem.location !== undefined && {
      location: scheduleItem.location,
    }),
    description: scheduleItem.isWorkingAlone
      ? 'You work alone :D'
      : "We don't know who you work with, but you definitely are not working alone :)",
    start: {
      dateTime: new Date(scheduleItem.startTime),
    },
    end: {
      dateTime: new Date(scheduleItem.endTime),
    },
  };

  if (scheduleItem.workWith && scheduleItem.workWith.length > 0) {
    eventObject = {
      ...eventObject,
      ...{
        description: `You work with: ${scheduleItem.workWith.join(',')}`,
      },
    };
  }

  return eventObject;
}

function sanitizeSchedule(scheduleItem) {
  return (
    scheduleItem.startTime !== undefined && scheduleItem.endTime !== undefined
  );
}

function loadGoogleLibraries(library) {
  return new Promise((resolve, reject) => {
    window.gapi.load(library, {
      callback: resolve,
      onerror: reject,
      timeout: 5000,
      ontimeout: reject,
    });
  });
}

export async function createEvents(schedule) {
  await loadGoogleLibraries('client');

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
