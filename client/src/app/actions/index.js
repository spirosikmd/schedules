import { setUser } from '../../shared/actions';
import { authenticateWithGoogle, loginWithEmailAndPassword } from '../api';

export const createUserFromAccessToken = (
  accessToken,
  expiresIn
) => async dispatch => {
  const response = await authenticateWithGoogle(accessToken, expiresIn);
  dispatch(setUser(response.user));
};

export const login = (email, password) => async dispatch => {
  const response = await loginWithEmailAndPassword({ email, password });
  dispatch(setUser(response.user));
};
