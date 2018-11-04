import { BASE } from './shared';

export async function authenticateWithGoogle(accessToken) {
  const response = await fetch(
    `${BASE}/auth/google?access_token=${accessToken}`
  );
  return response.json();
}

export function checkToken() {
  return fetch(`${BASE}/auth/token`);
}
