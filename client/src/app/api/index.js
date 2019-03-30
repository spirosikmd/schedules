import { BASE, getDefaultHeaders } from '../../shared/api';
import ApiError from '../../shared/api/ApiError';

export async function authenticateWithGoogle(accessToken, expiresIn) {
  const response = await fetch(
    `${BASE}/auth/google?access_token=${accessToken}&expires_in=${expiresIn}`
  );
  return response.json();
}

export async function loginWithEmailAndPassword(data) {
  const response = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: getDefaultHeaders(),
    body: JSON.stringify(data),
  });
  try {
    const json = await response.json();
    if (response.status < 400) {
      return json;
    }
    throw new ApiError('Cannot login', json.errors);
  } catch {
    throw new ApiError('Cannot login');
  }
}
