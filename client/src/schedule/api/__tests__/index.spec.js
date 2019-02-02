import { createEvents } from '../';

describe('createEvents', () => {
  let schedule;
  let startTime;
  let endTime;

  beforeEach(() => {
    startTime = new Date('2018-01-01');
    endTime = new Date('2018-01-02');
    schedule = [
      {
        workWith: ['test', 'test2'],
        location: 'Test',
        startTime,
        endTime,
      },
      {
        workWith: ['test3', 'test4'],
        location: 'Test5',
        startTime,
        endTime,
      },
      {
        workWith: ['test3', 'test4'],
        location: 'Test5',
      },
      {
        startTime,
        endTime,
      },
    ];

    window.gapi = {
      // Always resolve successfully when loading libraries.
      load: jest.fn((libraries, options) => options.callback()),
      client: {
        request: jest.fn(() =>
          Promise.resolve({
            result: 'success',
          })
        ),
      },
    };
  });

  it('calls google api request for each schedule item', async () => {
    await createEvents(schedule);
    expect(window.gapi.client.request).toHaveBeenCalledTimes(3);
    const calls = window.gapi.client.request.mock.calls;
    expect(calls[0][0]).toEqual({
      body: {
        description: 'You work with: test,test2',
        end: { dateTime: endTime },
        location: 'Test',
        start: { dateTime: startTime },
        summary: 'ACC',
      },
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      path: 'https://www.googleapis.com/calendar/v3/calendars/primary/events',
    });
    expect(calls[1][0]).toEqual({
      body: {
        description: 'You work with: test3,test4',
        end: { dateTime: endTime },
        location: 'Test5',
        start: { dateTime: startTime },
        summary: 'ACC',
      },
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      path: 'https://www.googleapis.com/calendar/v3/calendars/primary/events',
    });
    expect(calls[2][0]).toEqual({
      body: {
        description:
          "We don't know who you work with, but you definitely are not working alone :)",
        end: { dateTime: endTime },
        start: { dateTime: startTime },
        summary: 'ACC',
      },
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      path: 'https://www.googleapis.com/calendar/v3/calendars/primary/events',
    });
  });

  it('returns the result from each response', async () => {
    const result = await createEvents(schedule);
    expect(result).toEqual(['success', 'success', 'success']);
  });
});
