import { BASE, getDefaultHeaders } from './shared';

export async function fetchSettings() {
  return fetch(`${BASE}/settings`, { headers: getDefaultHeaders() }).then(
    response => response.json()
  );
}

export async function updateSettings(settingsId, person) {
  const response = await fetch(`${BASE}/settings/${settingsId}`, {
    method: 'PUT',
    headers: getDefaultHeaders(),
    body: JSON.stringify({
      person,
    }),
  });
  return response.json();
}
