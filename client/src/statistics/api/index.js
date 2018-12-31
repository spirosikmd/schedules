import { BASE, getDefaultHeaders } from '../../shared/api';

export async function fetchWeeklyWageData() {
  const response = await fetch(`${BASE}/aggregations/weekly-wage-data`, {
    headers: getDefaultHeaders(),
  });
  return response.json();
}

export async function fetchWeeklyHourData() {
  const response = await fetch(`${BASE}/aggregations/weekly-hour-data`, {
    headers: getDefaultHeaders(),
  });
  return response.json();
}

export async function fetchLocationHourData() {
  const response = await fetch(`${BASE}/aggregations/location-hour-data`, {
    headers: getDefaultHeaders(),
  });
  return response.json();
}
