import { createEvents } from '../events';

describe('createEvents', () => {
  let schedule;
  let startTime;
  let endTime;

  beforeEach(() => {
    startTime = new Date('2018-01-01');
    endTime = new Date('2018-01-02');
    schedule = [
      {
        worksWith: ['test', 'test2'],
        location: 'Test',
        startTime,
        endTime,
      },
      {
        worksWith: ['test3', 'test4'],
        location: 'Test5',
        startTime,
        endTime,
      },
    ];

    window.gapi = {
      client: {
        request: jest.fn(),
      },
    };
  });

  it('calls google api request for each schedule item', async () => {
    window.gapi.client.request.mockReturnValue(
      Promise.resolve({
        result: 'success',
      })
    );
    await createEvents(schedule);
    expect(window.gapi.client.request).toHaveBeenCalledTimes(2);
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
  });
});
