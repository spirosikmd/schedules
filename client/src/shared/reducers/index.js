export default (state = { user: null }, action) => {
  switch (action.type) {
    case 'SET_USER':
      return Object.assign({}, state, { user: action.user });
    case 'SET_USER_PROFILE_IMAGE_URL':
      return {
        ...state,
        user: {
          ...state.user,
          profileImageUrl: action.profileImageUrl,
        },
      };
    default:
      return state;
  }
};
