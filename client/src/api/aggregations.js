import { BASE, getDefaultHeaders } from './shared';

export async function fetchHolyTotal(person, hourlyWage) {
  const response = await fetch(
    `${BASE}/aggregations/holy-total?person=${person}&hourlyWage=${hourlyWage}`,
    {
      headers: getDefaultHeaders(),
    }
  );
  return response.json();
}

export async function fetchWeeklyWageDataAggregation(person, hourlyWage) {
  const response = await fetch(
    `${BASE}/aggregations/weekly-wage-data?person=${person}&hourlyWage=${hourlyWage}`,
    {
      headers: getDefaultHeaders(),
    }
  );
  return response.json();
}
