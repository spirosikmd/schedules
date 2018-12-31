import { BASE } from '../shared/api';
import ApiError from '../shared/ApiError';

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

export async function deleteUser() {
  const response = await fetch(`${BASE}/auth/users`, {
    method: 'DELETE',
  });
  return response.json();
}
