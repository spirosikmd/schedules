import { setUser } from '../../shared/actions';
import { authenticateWithGoogle } from '../api';

export const createUserFromAccessToken = (
  accessToken,
  expiresIn
) => async dispatch => {
  const response = await authenticateWithGoogle(accessToken, expiresIn);
  dispatch(setUser(response.user));
};
