const BASE = '/api';

export async function generateScheduleWithFileAndPerson(file) {
  const data = new FormData();
  data.set('scheduleFile', file);

  const response = await fetch(`${BASE}/upload`, {
    method: 'post',
    body: data,
  });

  const body = await response.json();

  if (response.status !== 200) throw Error(body.message);

  return body;
}

export async function fetchScheduleForPerson(person, hourlyWage) {
  const response = await fetch(
    `${BASE}/schedule?person=${person.toLowerCase()}&hourlyWage=${hourlyWage}`
  );
  const body = await response.json();

  if (response.status !== 200) throw Error(body.message);

  return body;
}
