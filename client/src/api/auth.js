import { BASE } from './shared';

export function authenticateWithGoogle(accessToken) {
  return fetch(`${BASE}/auth/google?access_token=${accessToken}`).then(
    response => response.json()
  );
}

export function checkToken() {
  return fetch(`${BASE}/auth/token`);
}
