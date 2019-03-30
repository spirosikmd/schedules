import { BASE, getDefaultHeaders } from '../../shared/api';
import ApiError from '../../shared/api/ApiError';

export async function registerWithEmailAndPassword(data) {
  const response = await fetch(`${BASE}/auth/register`, {
    method: 'POST',
    headers: getDefaultHeaders(),
    body: JSON.stringify(data),
  });
  try {
    const json = await response.json();
    if (response.status < 400) {
      return json;
    }
    throw new ApiError('Cannot register', json.errors);
  } catch {
    throw new ApiError('Cannot register');
  }
}
