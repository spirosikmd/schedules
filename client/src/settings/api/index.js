import { BASE } from '../../shared/api';

export async function deleteUser() {
  const response = await fetch(`${BASE}/auth/users`, {
    method: 'DELETE',
  });
  return response.json();
}
