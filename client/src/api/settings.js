import { BASE, getDefaultHeaders } from './shared';

export async function fetchSettings() {
  return fetch(`${BASE}/settings`, { headers: getDefaultHeaders() }).then(
    response => response.json()
  );
}

export function updateSettings(settingsId, person) {
  return fetch(`${BASE}/settings/${settingsId}`, {
    method: 'PUT',
    headers: getDefaultHeaders(),
    body: JSON.stringify({
      person,
    }),
  }).then(response => response.json());
}
