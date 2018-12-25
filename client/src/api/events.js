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
