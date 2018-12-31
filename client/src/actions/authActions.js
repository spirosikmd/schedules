import { authenticateWithGoogle, deleteUser as deleteUserApi } from '../api';

export const setUser = user => dispatch => {
  dispatch({
    type: 'SET_USER',
    user,
  });
};

export const createUserFromAccessToken = (
  accessToken,
  expiresIn
) => async dispatch => {
  const response = await authenticateWithGoogle(accessToken, expiresIn);
  dispatch(setUser(response.user));
};

const logout = () => async dispatch => {
  const auth2 = window.gapi.auth2.getAuthInstance();
  if (auth2 !== null) {
    await auth2.signOut();
    dispatch(setUser(null));
  }
};

export const deleteUser = () => async dispatch => {
  await deleteUserApi();
  dispatch(logout());
};
