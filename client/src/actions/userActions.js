import { authenticateWithGoogle } from '../api';

export const setUser = user => dispatch => {
  dispatch({
    type: 'SET_USER',
    user,
  });
};

export const createUserFromAccessToken = accessToken => dispatch => {
  return authenticateWithGoogle(accessToken).then(user => {
    dispatch(setUser(user));
  });
};
