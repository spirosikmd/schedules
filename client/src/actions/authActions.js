import { authenticateWithGoogle } from '../api';

export const setUser = user => dispatch => {
  dispatch({
    type: 'SET_USER',
    user,
  });
};

export const createUserFromAccessToken = (
  accessToken,
  expiresIn
) => dispatch => {
  return authenticateWithGoogle(accessToken, expiresIn).then(response => {
    dispatch(setUser(response.user));
  });
};
