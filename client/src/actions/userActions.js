import { authenticateWithGoogle } from '../api';

export const setUser = user => dispatch => {
  dispatch({
    type: 'SET_USER',
    user,
  });
};

export const setToken = token => dispatch => {
  dispatch({
    type: 'SET_TOKEN',
    token,
  });
};

export const createUserFromAccessToken = accessToken => dispatch => {
  return authenticateWithGoogle(accessToken).then(response => {
    dispatch(setToken(response.token));
    dispatch(setUser(response.user));
  });
};
