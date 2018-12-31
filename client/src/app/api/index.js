import { BASE } from '../../shared/api';

export async function authenticateWithGoogle(accessToken, expiresIn) {
  const response = await fetch(
    `${BASE}/auth/google?access_token=${accessToken}&expires_in=${expiresIn}`
  );
  return response.json();
}
