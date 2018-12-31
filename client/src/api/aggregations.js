import { BASE, getDefaultHeaders } from '../shared/api';

export async function fetchHolyTotal() {
  const response = await fetch(`${BASE}/aggregations/holy-total`, {
    headers: getDefaultHeaders(),
  });
  return response.json();
}
