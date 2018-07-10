import { createUser } from '../api';

export const setUser = user => dispatch => {
  dispatch({
    type: 'SET_USER',
    user,
  });
};

export const createUserFromAuthUser = authUser => dispatch => {
  const email = authUser.profileObj.email;

  return createUser(email).then(() => {
    dispatch(setUser(authUser));
  });
};
