import { setUser } from '../../shared/actions';
import { deleteUser } from '../api';

const logout = () => async dispatch => {
  const auth2 = window.gapi.auth2.getAuthInstance();
  if (auth2 !== null) {
    await auth2.signOut();
    dispatch(setUser(null));
  }
};

export const deleteUserAndLogout = () => async dispatch => {
  await deleteUser();
  dispatch(logout());
};
