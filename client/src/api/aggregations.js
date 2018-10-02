import { BASE, getDefaultHeaders } from './shared';

export function fetchHolyTotal(person, hourlyWage) {
  return fetch(
    `${BASE}/aggregations/holy-total?person=${person}&hourlyWage=${hourlyWage}`,
    {
      headers: getDefaultHeaders(),
    }
  ).then(response => response.json());
}

export function fetchWeeklyWageDataAggregation(person, hourlyWage) {
  return fetch(
    `${BASE}/aggregations/weekly-wage-data?person=${person}&hourlyWage=${hourlyWage}`,
    {
      headers: getDefaultHeaders(),
    }
  ).then(response => response.json());
}
