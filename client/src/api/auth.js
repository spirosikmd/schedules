import { BASE } from './shared';
import ApiError from './ApiError';

export async function authenticateWithGoogle(accessToken, expiresIn) {
  const response = await fetch(
    `${BASE}/auth/google?access_token=${accessToken}&expires_in=${expiresIn}`
  );
  return response.json();
}

export async function checkToken() {
  const response = await fetch(`${BASE}/auth/token`);
  if (response.status === 200) {
    return response;
  }
  throw new ApiError('Token not valid', response.error);
}
