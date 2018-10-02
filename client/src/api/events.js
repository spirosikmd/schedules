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
