import { BASE, getDefaultHeaders } from './shared';

export async function fetchHolyTotal() {
  const response = await fetch(`${BASE}/aggregations/holy-total`, {
    headers: getDefaultHeaders(),
  });
  return response.json();
}

export async function fetchWeeklyWageDataAggregation() {
  const response = await fetch(`${BASE}/aggregations/weekly-wage-data`, {
    headers: getDefaultHeaders(),
  });
  return response.json();
}

export async function fetchWeeklyHourDataAggregation() {
  const response = await fetch(`${BASE}/aggregations/weekly-hour-data`, {
    headers: getDefaultHeaders(),
  });
  return response.json();
}

export async function fetchLocationHourDataAggregation() {
  const response = await fetch(`${BASE}/aggregations/location-hour-data`, {
    headers: getDefaultHeaders(),
  });
  return response.json();
}
