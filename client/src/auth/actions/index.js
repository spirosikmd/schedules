import { registerWithEmailAndPassword } from '../api';

export const register = (email, password, confirmPassword) => async () => {
  await registerWithEmailAndPassword({
    email,
    password,
    confirmPassword,
  });
};

export const setUserProfileImageUrl = profileImageUrl => dispatch => {
  dispatch({
    type: 'SET_USER_PROFILE_IMAGE_URL',
    profileImageUrl,
  });
};
