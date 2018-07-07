const BASE = '/api';

export async function generateScheduleWithFileAndPerson(file) {
  const form = new FormData();
  form.append('scheduleFile', file);

  return fetch(`${BASE}/schedules`, {
    method: 'POST',
    body: form,
  });
}

export async function fetchScheduleForPerson(scheduleId, person, hourlyWage) {
  return fetch(
    `${BASE}/schedules/${scheduleId}/generate?person=${person}&hourlyWage=${hourlyWage}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  ).then(response => response.json());
}

export async function fetchSchedules() {
  return fetch(`${BASE}/schedules`).then(response => response.json());
}

export async function fetchSettings() {
  return fetch(`${BASE}/settings`).then(response => response.json());
}

export async function fetchSelectedScheduleId() {
  return fetch(`${BASE}/selected-schedule-id`).then(response =>
    response.json()
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

export function updateSchedule(scheduleId, data) {
  return fetch(`${BASE}/schedules/${scheduleId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then(response => response.json());
}
